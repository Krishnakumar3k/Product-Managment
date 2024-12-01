import { Container, Title, Table, Button, TextInput, Group } from '@mantine/core';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { notifications } from '@mantine/notifications';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  isApproved: boolean;
  isActive: boolean;
}

const AdminDashboard = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/admin/users?search=${search}`, {
        headers: { 'x-auth-token': token }
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token, search]);

  const handleAction = async (userId: string, action: string) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/users/${userId}`, 
        { action },
        { headers: { 'x-auth-token': token } }
      );
      notifications.show({
        title: 'Success',
        message: 'User status updated successfully',
        color: 'green',
      });
      fetchUsers();
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: error.response?.data?.message || 'Action failed',
        color: 'red',
      });
    }
  };

  return (
    <Container>
      <Title order={1} mb="xl">Admin Dashboard</Title>
      
      <Group mb="md">
        <TextInput
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Group>

      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{`${user.firstName} ${user.lastName}`}</td>
              <td>{user.email}</td>
              <td>{user.phoneNumber}</td>
              <td>
                {user.isApproved ? 'Approved' : 'Pending'} - 
                {user.isActive ? 'Active' : 'Blocked'}
              </td>
              <td>
                <Group>
                  {!user.isApproved && (
                    <Button size="xs" onClick={() => handleAction(user._id, 'approve')}>
                      Approve
                    </Button>
                  )}
                  <Button 
                    size="xs" 
                    color={user.isActive ? 'red' : 'green'}
                    onClick={() => handleAction(user._id, user.isActive ? 'block' : 'activate')}
                  >
                    {user.isActive ? 'Block' : 'Activate'}
                  </Button>
                </Group>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default AdminDashboard;