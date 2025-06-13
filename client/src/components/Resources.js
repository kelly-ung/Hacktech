import './Resources.css';
import image1 from './images/your-personal-financial-organizer.jpg';
import image2 from './images/40MoneyManagementTips.jpg';
import image3 from './images/CitiMoneyManagement101.jpg';


export default function Resources() {
   return (
    <>
        <h1 className="resources-title ">Extra Resources</h1>
        <div className="resources-page">
           <div className="resources-container">
                <img src={image1} alt="Personal Financial Organizer" width="300" />
                <div className="resource-link" >
                    <a href="https://www.emich.edu/human-resources/documents/your-personal-financial-organizer.pdf" target="_blank" rel="noopener noreferrer">
                        Your fiscal fitness review
                    </a>
                </div>
            </div>
            <div className="resources-container">
                <img src={image2} alt="Money Management Tips" width="300" />
                <div className="resource-link" >
                    <a href="https://www.sautech.edu/docs/studentResources/40MoneyManagementTips.pdf" target="_blank" rel="noopener noreferrer">
                        40 Money Management Tips
                    </a>
                </div>
            </div>
            <div className="resources-container">
                <img src={image3} alt="Citi Money Management 101" width="300" />
                <div className="resource-link" >
                    <a href="https://www.citigroup.com/rcs/citigpa/storage/public/CitiMoneyManagement101.pdf" target="_blank" rel="noopener noreferrer">
                        Money Management 101
                    </a>
                </div>
            </div>
        </div> 
    </>
   );
}
