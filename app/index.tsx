import { Redirect } from 'expo-router';

export default function Index() {
  // Thay vì vào thẳng app, ta điều hướng qua màn Login để demo Local Auth
  return <Redirect href="/login" />;
}
