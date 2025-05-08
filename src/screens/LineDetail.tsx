import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';


// Mock data for demo
const mockNotices = [
  {
    type: 'suspended',
    title: 'Service is suspended',
    message: 'From Monday 28 April to Friday 16 May, from 10:15 PM onwards, traffic will be suspended between Maisons-Laffitte and Poissy stations due to planned works. Reinforced bus 1 to Saint-Germain-en-Laye and bus to Achères-Ville.'
  },
  {
    type: 'notice',
    title: 'Service notice',
    message: 'On weekends from 3 to 25 May + 14 and 15 June, traffic will be suspended all day between Maisons-Laffitte and Poissy. On 4 May and 9 June, traffic will resume at 04:00 PM. Reinforced bus 1 at St Germain-en-Laye and bus at Achères-Ville.'
  }
];
const mockUpcoming = [
  {
    title: 'Planned service changes',
    message: 'On 8 May from 08:00 AM onwards, all access to Charles de Gaulle - Etoile station will be closed. Transfers in the station will not be possible. Due to: ceremony'
  },
  {
    title: 'Planned service changes',
    message: 'On weekends from 10 May to 25 May, traffic will be suspended all day between Maisons-Laffitte and Poissy.'
  }
];

const LineDetail = ({ route, navigation }: any) => {
  const { id, name, color } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Traffic - {name || id}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.lineInfoRow}>
          <View style={[styles.lineBadge, { backgroundColor: color || '#1E88E5' }]}> 
            <Text style={styles.lineBadgeText}>{id}</Text>
          </View>
          <Text style={styles.lineName}>{name}</Text>
        </View>
        <Text style={styles.sectionTitle}>In progress</Text>
        {mockNotices.map((notice, idx) => (
          <View
            key={idx}
            style={[styles.noticeBox, notice.type === 'suspended' ? styles.suspendedBox : styles.noticeBoxGreen]}
          >
            <View style={styles.noticeTitleRow}>
              
              <Text style={[styles.noticeTitle, notice.type === 'suspended' ? styles.suspendedTitle : styles.noticeTitleGreen]}>{notice.title}</Text>
            </View>
            <Text style={styles.noticeMessage}>{notice.message}</Text>
          </View>
        ))}
        <Text style={styles.sectionTitle}>Upcoming</Text>
        {mockUpcoming.map((item, idx) => (
          <View key={idx} style={styles.upcomingBox}>
            <View style={styles.upcomingTitleRow}>
             
              <Text style={styles.upcomingTitle}>{item.title}</Text>
            </View>
            <Text style={styles.upcomingMessage}>{item.message}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E2A8A',
    paddingTop: 40,
    paddingBottom: 16,
    paddingHorizontal: 12,
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  lineInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  lineBadge: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginRight: 10,
  },
  lineBadgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  lineName: {
    fontSize: 17,
    color: '#1E2A8A',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#444',
    marginTop: 18,
    marginBottom: 8,
  },
  noticeBox: {
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    backgroundColor: '#ffeaea',
  },
  suspendedBox: {
    backgroundColor: '#ffeaea',
    borderColor: '#e53935',
    borderWidth: 1,
  },
  noticeBoxGreen: {
    backgroundColor: '#e8f5e9',
    borderColor: '#388e3c',
    borderWidth: 1,
  },
  noticeTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  noticeTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  suspendedTitle: {
    color: '#e53935',
  },
  noticeTitleGreen: {
    color: '#388e3c',
  },
  noticeMessage: {
    color: '#333',
    fontSize: 14,
    marginTop: 2,
  },
  upcomingBox: {
    backgroundColor: '#fafafa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  upcomingTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  upcomingTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#444',
  },
  upcomingMessage: {
    color: '#333',
    fontSize: 13,
    marginTop: 2,
  },
});

export default LineDetail; 