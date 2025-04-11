import Database from '../../components/Database';
import '../../styles/Stock.css';
import Leftside from '../../components/Leftside';

function Stock() {
    return (
        <div className='stock-main'>
            <Leftside/>
            <Database/>
        </div>
    );
}

export default Stock;