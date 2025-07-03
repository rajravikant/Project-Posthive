import useAuthStore from '@/store/authStore';
import { Redirect, Slot, useSegments } from 'expo-router';

const Layout = () => {
  const segments = useSegments();
  const inAuthGroup = segments[1] === '(authenticated)';


const {isAuthenticated,isGuest} = useAuthStore()

  if (!isAuthenticated  && inAuthGroup) {
    return <Redirect href="/welcome" />;
  }

  if ((isAuthenticated || isGuest) && !inAuthGroup) {
    return <Redirect href="/(app)/(authenticated)/(tabs)" />;
  }

  return <Slot screenOptions={{ headerShown: false }} />;
};

export default Layout;