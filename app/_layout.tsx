import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MusicDiscoveryPage from './MusicDiscoveryPage';
import CreationPage from './CreationPage';
import MePage from './MePage';
import FanClubPage from './FanClubPage';
import FanClubOverviewPage from './FanClubOverviewPage';
import PostDetailPage from './PostDetailPage';

const Stack = createStackNavigator();

const Layout = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MusicDiscoveryPage"
        component={MusicDiscoveryPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CreationPage"
        component={CreationPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MePage"
        component={MePage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="FanClubPage"
        component={FanClubPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="FanClubOverviewPage"
        component={FanClubOverviewPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PostDetailPage"
        component={PostDetailPage}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default Layout;