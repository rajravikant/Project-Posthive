import { Link, Stack } from 'expo-router';
import { Fragment } from 'react';
import { Text, View } from 'react-native';

export default function NotFoundScreen() {
  return (
    <Fragment>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View className="flex-1 items-center justify-center p-10">
        <Text>This screen doesn't exist.</Text>
        <Link href="/" className="text-blue-500 mt-4">
          <Text >Go to home screen!</Text>
        </Link>
      </View>
    </Fragment>
  );
}
  
