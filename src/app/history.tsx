import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { MotiView } from 'moti';
import { LucideChevronLeft, LucideHistory, LucideTrash2 } from 'lucide-react-native';
import { AuraBackground } from '@/components/AuraBackground';
import { useAuraContext } from '@/context/AuraContext';
import { COLORS } from '@/constants/theme';

const { width } = Dimensions.get('window');

export default function HistoryScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { history, clearHistory, triggerHaptic } = useAuraContext();

  const handleClear = () => {
    triggerHaptic('heavy');
    clearHistory();
  };

  const renderItem = ({ item }: { item: any }) => (
    <MotiView 
       from={{ opacity: 0, translateY: 20 }}
       animate={{ opacity: 1, translateY: 0 }}
       style={styles.historyCard}
    >
       <View style={[styles.colorIndicator, { backgroundColor: getAuraColor(item.color) }]} />
       <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardDate}>{new Date().toLocaleDateString()}</Text>
          <Text style={styles.cardDesc} numberOfLines={2}>{item.description}</Text>
       </View>
    </MotiView>
  );

  const getAuraColor = (color: string) => {
    switch(color) {
      case 'indigo': return '#4B0082';
      case 'jade': return '#00A86B';
      case 'ruby': return '#E0115F';
      case 'gold': return '#FFD700';
      case 'violet': return '#8F00FF';
      default: return '#00FF9C';
    }
  };

  return (
    <AuraBackground>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
           <LucideChevronLeft color={COLORS.secondary} size={30} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('history_title', { defaultValue: 'Soul History' })}</Text>
        <TouchableOpacity onPress={handleClear} style={styles.clearBtn}>
           <LucideTrash2 color={COLORS.error} size={24} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={history}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyState}>
             <LucideHistory color="rgba(255,255,255,0.1)" size={80} />
             <Text style={styles.emptyText}>Your soul has no recorded history yet.</Text>
          </View>
        }
      />
    </AuraBackground>
  );
}

const styles = StyleSheet.create({
  topBar: {
    paddingTop: 60,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  backBtn: { padding: 10 },
  headerTitle: {
    color: COLORS.secondary,
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 2,
  },
  clearBtn: { padding: 10 },
  listContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  historyCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    padding: 15,
    flexDirection: 'row',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  colorIndicator: {
    width: 6,
    borderRadius: 3,
    marginRight: 15,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  cardDate: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
    marginBottom: 6,
  },
  cardDesc: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    lineHeight: 20,
  },
  emptyState: {
    marginTop: 100,
    alignItems: 'center',
    opacity: 0.5,
  },
  emptyText: {
    color: '#FFF',
    marginTop: 20,
    fontSize: 16,
    textAlign: 'center',
  },
});
