import { BrowserRouter,Routes,Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CreateRFQ from './pages/CreateRFQ';
import AuctionList from './pages/AuctionList';
import AuctionDetails from './pages/AuctionDetails';
import SupplierBid from './pages/SupplierBid';
export default function App(){
 return <BrowserRouter><Navbar/><Routes>
 <Route path='/' element={<Home/>}/>
 <Route path='/create' element={<CreateRFQ/>}/>
 <Route path='/rfqs' element={<AuctionList/>}/>
 <Route path='/rfq/:id' element={<AuctionDetails/>}/>
 <Route path='/bid' element={<SupplierBid/>}/>
 </Routes></BrowserRouter>
}