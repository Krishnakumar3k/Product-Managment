import { Container, Title, Text, Card, SimpleGrid } from '@mantine/core';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);

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
      <Title order={1} mb="xl">Dashboard</Title>
      <SimpleGrid cols={2}>
        <Card shadow="sm" p="lg">
          <Title order={3}>Recent Orders</Title>
          <Text>Total Orders: {orders.length}</Text>
        </Card>
      </SimpleGrid>
    </Container>
  );
};

export default Dashboard;