import os
from flask import Flask, jsonify
from flask_cors import CORS
from flask import request
import matplotlib
matplotlib.use('Agg') # tell matplotlib to use a non-GUI backend
import matplotlib.pyplot as plt
import io
import base64
from google import generativeai as genai
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# Allow all origins by default for routes
CORS(app)

# Initialize GoogleGenAI with your API Key
API_KEY = os.getenv("GOOGLE_AI_API_KEY")

if not API_KEY:
    raise ValueError("GOOGLE_AI_API_KEY environment variable is not set")

# # Configure the generativeai library with the API key
# genai.configure(api_key=API_KEY)

# # Route to handle chat with Gemini AI
# @app.route('/chat', methods=['POST'])
# def chat():
#     data = request.get_json()
#     user_message = data.get('message')

#     if not user_message:
#         return jsonify({'response': 'Error: No message provided.'}), 400

#     try:
#         # Create a model instance
#         model = genai.GenerativeModel('gemini-1.5-pro')
        
#         # Generate content using the user's message
#         response = model.generate_content(f"""
#         You are a helpful financial advisor named Budgetnator. The user said: "{user_message}"
#         Based on their message, help them set or reach financial goals with realistic and practical advice.
#         Please keep answers short but informative.
#         """)
        
#         # Extract the text from the response
#         ai_response = response.text
        
#         return jsonify({'response': ai_response})
#     except Exception as e:
#         print(f"Error calling Gemini API: {str(e)}")


# Pie chart endpoint
@app.route('/pie-chart', methods=['POST'])
def generate_pie_chart():
    data = request.get_json()  

    # Calculate the total expenses for each category 
    total_per_category = {}
    for expense in data["expenses"]:
        if expense["category"] not in total_per_category:
            total_per_category[expense["category"]] = expense["amount"]
        else:
            total_per_category[expense["category"]] += expense["amount"]
    
    # Separate in lists
    expenses = []
    categories = []
    for category, total in total_per_category.items():
        categories.append(category)
        expenses.append(total)


    plt.figure(figsize=(8, 6))
    plt.pie(expenses, labels=categories, autopct='%1.1f%%', startangle=90)
    plt.title('Expense Breakdown')

    # Save the plot to a buffer
    img = io.BytesIO()
    plt.savefig(img, format='png')
    img.seek(0)

    # Encode the image as base64 and add the correct data URL prefix
    plot_base64 = base64.b64encode(img.getvalue()).decode()
    plot_url = f"data:image/png;base64,{plot_base64}"

    # Close the plot so it doesn't keep stacking up in memory
    plt.close()

    return jsonify({"plot_url": plot_url})

# Emergency fund endpoint
@app.route('/emergency-fund', methods=['POST'])
def calculate_emergency_fund():
   data = request.get_json()
   total_expenses =  0
   for expense in data['expenses']:
         total_expenses += int(expense['amount'])


   print(f"Total expenses: ${total_expenses}")
   total_savings_goal = total_expenses * 5
   income = data["income"]
   past_month_left = (income/12) - total_expenses
   past_week_left = past_month_left * 12 / 52
   willing_to_save = 0.5
   weekly_savings_goal = total_savings_goal / (willing_to_save * past_week_left)
   print(weekly_savings_goal)

   return jsonify(
      {"weeklyGoal": round(weekly_savings_goal, 2), "totalGoal": round(total_savings_goal, 2)}
   )

# Personal goal endpoint
@app.route('/personal-goal', methods=['POST'])
def calculate_personal_goal():
  data = request.get_json()
  personal_goal = data['goal']
  total_expenses =  0
  for expense in data['expenses']:
      total_expenses += int(expense['amount'])

  print(f"Total expenses: ${total_expenses}")
  income = data["income"]
  past_month_left = (income/12) - total_expenses
  past_week_left = past_month_left * 12 / 52
  willing_to_save = float(data["goalPercent"]) / 100
  weekly_savings_goal = personal_goal / (willing_to_save * past_week_left)
  print(weekly_savings_goal)

  return jsonify({"weeklyGoal": round(weekly_savings_goal, 2), "totalGoal": round(personal_goal, 2), "percent": data["goalPercent"]})


if __name__ == '__main__':
    app.run(debug=True)
