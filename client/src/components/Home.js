import './Home.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase'

export default function Home({ loggedIn, userId }) {
    // Track user input for calculating savings goals
    const [income, setIncome] = useState(null);
    const [goal, setGoal] = useState(null);
    const [goalPercent, setGoalPercent] = useState(''); 
    const [expenses, setExpenses] = useState([{ amount: '', category: ''}]);
    // Data returned from API
    const [emergencyFundGoal, setEmergencyFundGoal] = useState(null);
    const [weeksToGoal, setWeeksToGoal] = useState(null);
    const [pieChart, setPieChart] = useState(null);
    // Display error if not all inputs are provided
    const [error, setError] = useState(false); 
    // To set edit mode
    const [edit, setEdit] = useState(false);
    // To close banner message
    const [close, setClose] = useState(false);

    // Fetch data from database when user is authenticated
    useEffect(() => {
        if (loggedIn && userId) {
            const docRef = doc(db, "finances", userId);
            const fetchData = async () => {
                try {
                    const docSnap = await getDoc(docRef);
                    // If userID mataches and the document exists then retrieve the data 
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        setIncome(data.income);
                        setGoal(data.goal);
                        setGoalPercent(data.goalPercent);
                        setExpenses(data.expenses);
                        setEmergencyFundGoal(data.emergencyFundGoal);
                        setWeeksToGoal(data.weeksToGoal);
                        setPieChart(data.pieChart);
                    }
                }
                catch {
                    // docSnap.data() will be undefined in this case
                    console.log("No such document!");
                }
            }
            fetchData();
        } else if (!loggedIn) { // If user logs out then set states to default values
            setIncome(null); 
            setGoal(null);
            setGoalPercent(null);
            setExpenses([{ amount: '', category: ''}]);
            setEmergencyFundGoal(null);
            setWeeksToGoal(null);
            setPieChart(null);
            setError(null);
            setEdit(false);
        }
    }, [loggedIn, userId]);

    // Add a new expense to the array
    const handleExpenseChange = (index, field, value) => {
        const updatedExpenses = [...expenses];
        updatedExpenses[index][field] = value;
        setExpenses(updatedExpenses);
    };

    // Create an empty expense when users selects the add button
    const addExpense = () => {
        setExpenses([...expenses, { amount: '', category: ''}]);
    };

    // Calls API when form is submitted
    const sendUserInput = (e) => {
        e.preventDefault();
        // These fields are necessary for calculations
        if (income === null || goal === null || goalPercent === null) {
            setError(true);
            return;
        }

        // Create all the API requests
        const emergencyFundRequest = axios.post('https://budgetnator-server.onrender.com/emergency-fund', {
            income: income,
            goal: goal,
            expenses: expenses
        });

        const personalGoalRequest = axios.post('https://budgetnator-server.onrender.com/personal-goal', {
            income: income,
            goal: goal,
            expenses: expenses,
            goalPercent: goalPercent
        });

        const pieChartRequest = axios.post('https://budgetnator-server.onrender.com/pie-chart', {
            income: income,
            goal: goal,
            expenses: expenses,
            goalPercent: goalPercent
        });

        // Run all requests together and wait for completion
        Promise.all([emergencyFundRequest, personalGoalRequest, pieChartRequest])
            .then(([emergencyFundRes, personalGoalRes, pieChartRes]) => {
                setEmergencyFundGoal(emergencyFundRes.data);
                setWeeksToGoal(personalGoalRes.data);
                setPieChart(pieChartRes.data);

                // Update the database 
                addResultsToDatabase(emergencyFundRes.data, personalGoalRes.data, pieChartRes.data);
                setError(false); 
            })
            .catch(error => {
                console.error('Error during API calls:', error);
            });
    };


    // Function to update input fields in the database
    const addInputToDatabase = () => {
        if (loggedIn) {
            const docRef = doc(db, 'finances', userId);
            setDoc(docRef, {
                income: income,
                goal: goal,
                goalPercent: goalPercent
            }, { merge: true });
        }
    }

    // Function to update results fields in the database
    const addResultsToDatabase = (emergency, personal, graph) => {
         if (loggedIn) {
            const docRef = doc(db, 'finances', userId);
            setDoc(docRef, {
                expenses: expenses,
                emergencyFundGoal: emergency,
                weeksToGoal: personal,
                pieChart: graph
            }, { merge: true });
        }
    }

    // Detect when user selects edit button
    const handleEdit = () => {
        if (!edit === false) { 
            addInputToDatabase(); // update database when user submits
        }
        setEdit(!edit);
    }

    // Close log in to save your progress message 
    const handleClose = () => {
        setClose(true);
    }

    return (
        <div>
            <h1 className="home-title">Budget Tool</h1>
                {(!loggedIn && !close) && 
                    <div className="banner">
                        <a href="/AuthPage">Log in to save your progress</a>
                        <button className="close-button" onClick={handleClose}>X</button>
                    </div>
                }
            <div className="input-container">
                <div className="input-box-centered">
                    <h3>Income and Savings Goals</h3>
                    {!edit ? 
                    <>
                        {/* Input for income */}
                        <label className="income-label">Yearly Income: </label>
                        <div className='input-edit'>
                            {income ? income : <i>No income provided</i>} 
                        </div>

                        {/* Input for personal goal */}
                        <label className="goal-label">Personal Long-Term Goal: </label>
                        <div className='input-edit'>
                            {goal ? goal : <i>No goal provided</i>} 
                        </div>

                        {/* Dropdown for personal goal percentage */}
                        <label className="personal-goal-label">Percent to save to personal goal: </label>
                        <div className='input-edit'>
                            {goalPercent ?  (`${goalPercent}%`)  : <i>No percent provided</i>} 
                        </div>
                        
                        <button className="edit-button" onClick={handleEdit}>Edit</button>  
                    </>
                    :
                    <>
                        {/* Edit mdoe for income */}
                        <label className="income-label">Yearly Income: </label>
                        <div>
                            <input
                                type="number"
                                value={income || ''}
                                onChange={e => setIncome(Number(e.target.value))}
                            /> 
                        </div>

                        {/* Edit mode for personal goal */}
                        <label className="goal-label">Personal Long-Term Goal: </label>
                        <div>
                            <input
                                type="number"
                                value={goal || ''}
                                onChange={e => setGoal(Number(e.target.value))}
                            />
                        </div>
                        
                        {/* Edit mode for personal goal percentage */}
                        <label className="personal-goal-label">Percent to save to personal goal: </label>
                        <div>
                            <select
                                value={goalPercent}
                                onChange={e => setGoalPercent(e.target.value)}
                            >
                                <option value="">Select a percentage</option>
                                <option value="25">25%</option>
                                <option value="50">50%</option>
                                <option value="75">75%</option>
                                <option value="100">100%</option>
                            </select>
                        </div>

                        <button className="edit-button" onClick={handleEdit}>Submit</button>
                    </>
                    }  
                </div>
            </div>
            
            <div className="input-container">
                {/* Input for expenses */}
                <div className="input-box">
                    <h3>Your Expenses</h3>
                    <form onSubmit={sendUserInput}>
                        {expenses.map((expense, index) => (
                            <div key={index} className="expense-input">
                                <label className="amount-label">Expense: </label>
                                <input
                                    type="number"
                                    value={expense.amount}
                                    onChange={e => handleExpenseChange(index, 'amount', e.target.value)}
                                    placeholder="Enter amount"
                                    required
                                />
                                <label className="category-label">Category: </label>
                                <select
                                    value={expense.category}
                                    onChange={e => handleExpenseChange(index, 'category', e.target.value)}
                                    required
                                >
                                    <option value="" disabled selected>Select a category</option> 
                                    <option value="food">Food</option>
                                    <option value="transportation">Transportation</option>
                                    <option value="entertainment">Entertainment</option>
                                    <option value="utilities">Utilities</option>
                                    <option value="healthcare">Healthcare</option>
                                    <option value="housing">Housing</option>
                                    <option value="education">Education</option>
                                    <option value="clothing">Clothing</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        ))}

                        {/* Buttons outside of the expense mapping */}
                        <div className="buttons-div">
                            <button className="add-button" onClick={addExpense}>Add Expense</button>
                            <button className="submit-button" type="submit">Submit</button>
                        </div>
                    </form>

                    {/* Error message */}
                    <p className='error'>{error && "Error: Please define your Income and Savings Goals."}</p>

                    {/* Results from budget calculation */}
                    {emergencyFundGoal && (<>
                        <h2>Emergency Funds Goal</h2>
                        {emergencyFundGoal.weeklyGoal < 0 ? <p className='error'>Error: Total expenses are too high.</p> :
                        <>
                            <p>Weeks to Goal at 50% Savings Rate: <b>{emergencyFundGoal.weeklyGoal}</b></p>
                            <p>Recommended Savings Goal: <b>${emergencyFundGoal.totalGoal}</b></p>
                        </>
                        }
                    </>
                    )}
                    {weeksToGoal && (<>
                        <h2>Personal Goal</h2>
                        {weeksToGoal.weeklyGoal < 0 ? <p className='error'>Error: Total expenses are too high</p> : 
                            <>
                                <p>Weeks to Goal at {weeksToGoal.percent}% Savings Rate: <b>{weeksToGoal.weeklyGoal}</b></p>
                                <p>Total Savings Goal: <b>${weeksToGoal.totalGoal}</b></p>
                            </>
                        }
                        
                    </>
                    )}
                    {pieChart && (<>
                        <img src={pieChart.plot_url} alt="Pie Chart" />
                    </>
                    )}
                </div>
            </div>
        </div>
    );
}
