import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList } from 'react-native';
import { AntDesign, Ionicons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { NavigationProp } from '@react-navigation/native';

type Props = {
  navigation: NavigationProp<any, any>;
};

const FanClubPage: React.FC<Props> = ({ navigation }) => {
  const fanClubData = [
    { id: '1', name: 'Jay Chou', image: require('../assets/jay-chou.jpg') },
    { id: '2', name: 'Ariana Grande', image: require('../assets/ariana-grande.jpg') },
    { id: '3', name: 'Adele', image: require('../assets/adele.jpg') },
  ];

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.itemContainer}
      onPress={() => navigation.navigate('FanClubOverviewPage', { name: item.name })} // Pass the name as a parameter
    >
      <Image source={item.image} style={styles.avatar} />
      <Text style={styles.name}>{item.name}</Text>
      <AntDesign name="right" size={16} color="gray" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Top navigation buttons */}
      <View style={styles.topNavigation}>
        <TouchableOpacity>
          <Text style={[styles.topButton, styles.activeButton]}>Fan Club</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('MusicDiscoveryPage')}>
          <Text style={styles.topButton}>Discovery</Text>
        </TouchableOpacity>
      </View>

      {/* Fan Club List */}
      <FlatList
        data={fanClubData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContentContainer}
      />

      {/* Bottom navigation bar */}
      <View style={styles.bottomNavigation}>
        <TouchableOpacity onPress={() => navigation.navigate('HomePage')} style={styles.navItem}>
          <AntDesign name="home" size={24} color="gray" />
          <Text style={styles.bottomButtonText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('MusicDiscoveryPage')} style={styles.navItem}>
          <MaterialIcons name="music-note" size={24} color="gray" />
          <Text style={styles.bottomButtonText}>Music</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('CreationPage')} style={styles.navItem}>
          <FontAwesome5 name="plus-square" size={24} color="gray" />
          <Text style={styles.bottomButtonText}>Create</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('InboxPage')} style={styles.navItem}>
          <Ionicons name="mail-outline" size={24} color="gray" />
          <Text style={styles.bottomButtonText}>Inbox</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('MePage')} style={styles.navItem}>
          <Ionicons name="person-outline" size={24} color="gray" />
          <Text style={styles.bottomButtonText}>Me</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingBottom: 60, // Padding for the navigation bar
  },
  topNavigation: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10,
    marginTop: 60, // Further increased margin to move the buttons lower
  },
  topButton: {
    color: 'gray',
    fontSize: 16,
    marginHorizontal: 20,
  },
  activeButton: {
    fontWeight: 'bold',
    borderBottomWidth: 2,
    borderBottomColor: 'gray',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 15,
  },
  name: {
    flex: 1,
    fontSize: 16,
  },
  notificationTitle: {
    textAlign: 'center',
    fontSize: 16,
    marginVertical: 20,
  },
  notificationText: {
    textAlign: 'center',
    fontSize: 14,
    color: 'gray',
  },
  bottomNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    position: 'absolute',
    bottom: 30, // Adjusted to match the height of the MusicDiscoveryPage navigation bar
    width: '100%',
  },
  navItem: {
    alignItems: 'center',
  },
  bottomButtonText: {
    color: 'gray',
    fontSize: 10,
  },
  listContentContainer: {
    paddingTop: 40, // Adjust this value to move the list lower
  },
});

export default FanClubPage;