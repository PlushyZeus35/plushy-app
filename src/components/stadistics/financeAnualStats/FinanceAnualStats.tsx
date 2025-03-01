import { Finance } from "@/app/types/Finance";
import "./FinanceAnualStats.css";
import FinanceAnualGeneralLine from "../financeAnualGeneralLine/FinanceAnualGeneralLine";
import FinanceAnualTipology from "../financeAnualTipology/FinanceAnualTipology";
import NetMonthlyCashFlow from "../netMonthlyCashFlow/NetMonthlyCashFlow";
import FinanceAnualCategories from "../financeAnualCategories/FinanceAnualCategories";
import FinanceAnualKpis from "../financeAnualKpis/FinanceAnualKpis";
interface FinanceRec {
    items: Finance[];
}

const FinanceAnualStats: React.FC<FinanceRec> = ({ items }) => {

    return (
        <>
            <div className="card mt-3" style={{color: "#f5f5f5", padding: "2rem"}}>
                <div className="d-flex flex-column gap-4">
                    <FinanceAnualGeneralLine items={items} />
                    <FinanceAnualTipology items={items} />
                    <NetMonthlyCashFlow items={items}/>
                    <FinanceAnualCategories items={items}/>
                    <hr style={{
                        borderTop: '1px solid rgba(255, 255, 255, 1)',
                        margin: '1rem 0'
                    }}/>
                    <FinanceAnualKpis items={items}/>
                </div>
            </div>
        </>
    );
};

export default FinanceAnualStats;