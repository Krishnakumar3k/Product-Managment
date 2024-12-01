import { Container, Title, Card, SimpleGrid, Text, Button, Group, NumberInput } from '@mantine/core';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { notifications } from '@mantine/notifications';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  warehouse: {
    name: string;
  };
}

const Products = () => {
  const { token, isAdmin } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products', {
        headers: { 'x-auth-token': token }
      });
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [token]);

  const handleOrder = async (productId: string) => {
    try {
      await axios.post('http://localhost:5000/api/orders', {
        products: [{
          productId,
          quantity: quantities[productId] || 1
        }]
      }, {
        headers: { 'x-auth-token': token }
      });
      
      notifications.show({
        title: 'Success',
        message: 'Order placed successfully',
        color: 'green',
      });
      
      fetchProducts();
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: error.response?.data?.message || 'Failed to place order',
        color: 'red',
      });
    }
  };

  return (
    <Container>
      <Title order={1} mb="xl">Products</Title>
      <SimpleGrid cols={3}>
        {products.map((product) => (
          <Card key={product._id} shadow="sm" p="lg">
            <Title order={3}>{product.name}</Title>
            <Text>{product.description}</Text>
            <Text>Price: ${product.price}</Text>
            <Text>Stock: {product.stock}</Text>
            <Text>Warehouse: {product.warehouse.name}</Text>
            
            {!isAdmin && (
              <Group mt="md">
                <NumberInput
                  min={1}
                  max={product.stock}
                  value={quantities[product._id] || 1}
                  onChange={(value) => setQuantities({
                    ...quantities,
                    [product._id]: value || 1
                  })}
                />
                <Button 
                  onClick={() => handleOrder(product._id)}
                  disabled={product.stock === 0}
                >
                  Order
                </Button>
              </Group>
            )}
          </Card>
        ))}
      </SimpleGrid>
    </Container>
  );
};

export default Products;