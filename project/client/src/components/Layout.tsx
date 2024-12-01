import { AppShell, Navbar, Header, Text, Button, Group } from '@mantine/core';
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Layout = () => {
  const { logout, isAdmin } = useAuth();

  return (
    <AppShell
      padding="md"
      navbar={
        <Navbar width={{ base: 300 }} p="xs">
          {isAdmin ? (
            <>
              <Link to="/admin">Dashboard</Link>
              <Link to="/products">Products</Link>
              <Link to="/orders">Orders</Link>
            </>
          ) : (
            <>
              <Link to="/">Dashboard</Link>
              <Link to="/products">Products</Link>
              <Link to="/orders">My Orders</Link>
            </>
          )}
        </Navbar>
      }
      header={
        <Header height={60} p="xs">
          <Group position="apart">
            <Text>Warehouse Management System</Text>
            <Button onClick={logout}>Logout</Button>
          </Group>
        </Header>
      }
    >
      <Outlet />
    </AppShell>
  );
};

export default Layout;