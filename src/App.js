// jshint esversion:9
import { CartContainer } from './components/CartContainer';
import { Navbar } from './components/Navbar';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { calculateTotals, getCartItems } from './redux/features/cart/cartSlice';
import { Modal } from './components/Modal';

function App() {
  const dispatch = useDispatch();

  const { cartItems, isLoading } = useSelector((store) => store.cart); //accessing state
  const { isOpen } = useSelector((store) => store.modal); //accessing state here and using the modal action on CartContainer

  useEffect(() => {
    dispatch(calculateTotals());
  }, [cartItems]);

  useEffect(() => {
    dispatch(getCartItems('example of optional data'));
  }, []);

  if (isLoading) {
    return (
      <div className='loading'>
        <h1>Loading...</h1>
      </div>
    );
  }
  return (
    <main>
      {isOpen && <Modal />}
      <Navbar />
      <CartContainer />
    </main>
  );
}
export default App;
