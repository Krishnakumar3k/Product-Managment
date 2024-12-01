import { Container, Title, Table, Badge } from '@mantine/core';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface Order {
  _id: string;
  products: Array<{
    product: {
      name: string;
    };
    quantity: number;
    price: number;
  }>;
  status: string;
  totalAmount: number;
  createdAt: string;
}

const Orders = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/orders', {
          headers: { 'x-auth-token': token }
        });
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, [token]);

  return (
    <Container>
      <Title order={1} mb="xl">Orders</Title>
      <Table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Products</th>
            <th>Total Amount</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>
                {order.products.map((item, index) => (
                  <div key={index}>
                    {item.product.name} x {item.quantity}
                  </div>
                ))}
              </td>
              <td>${order.totalAmount}</td>
              <td>
                <Badge
                  color={
                    order.status === 'completed' ? 'green' :
                    order.status === 'pending' ? 'yellow' :
                    order.status === 'rejected' ? 'red' : 'blue'
                  }
                >
                  {order.status}
                </Badge>
              </td>
              <td>{new Date(order.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Orders;