import '../styles/Stock.css';
import '../styles/print.css';
import { Button } from "../components/Button";


function Orders() {
    const handlePrint = () => {
        window.print();
    };
    return (
        <div className="container">
             <div className="table-header">
                            <div className='title-holder'>
                                <h1>Indkøb</h1>
                            </div>
                            <div>
                                <Button label="Udskriv" variant="primary" onClick={handlePrint}/>
                            </div>
            </div>

            <div className="table-scroll-wrapper">
                  <table className="beholdning-tabel">
                    <tr>
                        <th>test</th>
                        <th>test</th>
                        <th>test</th>
                        <th>test</th>
                        <th>test</th>
                        <th>test</th>
                        <th>test</th>
                    </tr>
                    <tbody>
                        <td>test</td>
                        <td>test</td>
                        <td>test</td>
                        <td>test</td>
                        <td>test</td>
                        <td>test</td>
                        <td>test</td>
                    </tbody>
                  </table>
            </div>
        </div>

    );
}

export default Orders;