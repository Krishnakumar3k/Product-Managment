import { TextInput, PasswordInput, Button, Paper, Title, Container, NumberInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface SignupForm {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  location: {
    coordinates: [number, number];
  };
}

const Signup = () => {
  const navigate = useNavigate();

  const form = useForm<SignupForm>({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      password: '',
      location: {
        coordinates: [0, 0]
      }
    },
    validate: {
      firstName: (value) => (value.length < 2 ? 'First name must be at least 2 characters' : null),
      lastName: (value) => (value.length < 2 ? 'Last name must be at least 2 characters' : null),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      phoneNumber: (value) => (/^\d{10}$/.test(value) ? null : 'Invalid phone number'),
      password: (value) => (value.length < 6 ? 'Password must be at least 6 characters' : null),
    },
  });

  const handleSubmit = async (values: SignupForm) => {
    try {
      await axios.post('http://localhost:5000/api/users/signup', values);
      notifications.show({
        title: 'Success',
        message: 'Registration successful! Please wait for admin approval.',
        color: 'green',
      });
      navigate('/login');
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: error.response?.data?.message || 'Registration failed',
        color: 'red',
      });
    }
  };

  return (
    <Container size={420} my={40}>
      <Title ta="center">Create an account</Title>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="First Name"
            placeholder="John"
            required
            {...form.getInputProps('firstName')}
          />
          <TextInput
            label="Last Name"
            placeholder="Doe"
            required
            mt="md"
            {...form.getInputProps('lastName')}
          />
          <TextInput
            label="Email"
            placeholder="you@example.com"
            required
            mt="md"
            {...form.getInputProps('email')}
          />
          <TextInput
            label="Phone Number"
            placeholder="1234567890"
            required
            mt="md"
            {...form.getInputProps('phoneNumber')}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            required
            mt="md"
            {...form.getInputProps('password')}
          />
          <NumberInput
            label="Latitude"
            required
            mt="md"
            precision={6}
            {...form.getInputProps('location.coordinates.1')}
          />
          <NumberInput
            label="Longitude"
            required
            mt="md"
            precision={6}
            {...form.getInputProps('location.coordinates.0')}
          />
          <Button fullWidth mt="xl" type="submit">
            Sign up
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default Signup;