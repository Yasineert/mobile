import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { colors, spacing, typography, borderRadius } from '../theme/theme';
import Button from './Button';
import Input from './Input';

interface FilterOption {
  id: string;
  label: string;
  selected: boolean;
}

export interface Filters {
  sector: string[];
  location: string;
  duration: string;
  contractType: string[];
}

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApplyFilters: (filters: Filters) => void;
  initialFilters?: Partial<Filters>;
}

const FilterModal = ({
  visible,
  onClose,
  onApplyFilters,
  initialFilters,
}: FilterModalProps) => {
  // Sectors
  const [sectors, setSectors] = useState<FilterOption[]>([
    { id: 'tech', label: 'Technologie', selected: initialFilters?.sector?.includes('tech') || false },
    { id: 'education', label: 'Éducation', selected: initialFilters?.sector?.includes('education') || false },
    { id: 'health', label: 'Santé', selected: initialFilters?.sector?.includes('health') || false },
    { id: 'finance', label: 'Finance', selected: initialFilters?.sector?.includes('finance') || false },
    { id: 'engineering', label: 'Ingénierie', selected: initialFilters?.sector?.includes('engineering') || false },
    { id: 'marketing', label: 'Marketing', selected: initialFilters?.sector?.includes('marketing') || false },
  ]);

  // Location
  const [location, setLocation] = useState(initialFilters?.location || '');

  // Duration
  const [duration, setDuration] = useState(initialFilters?.duration || '');

  // Contract Types
  const [contractTypes, setContractTypes] = useState<FilterOption[]>([
    { id: 'internship', label: 'Stage', selected: initialFilters?.contractType?.includes('internship') || false },
    { id: 'apprenticeship', label: 'Alternance', selected: initialFilters?.contractType?.includes('apprenticeship') || false },
    { id: 'partTime', label: 'Temps partiel', selected: initialFilters?.contractType?.includes('partTime') || false },
    { id: 'fullTime', label: 'Temps plein', selected: initialFilters?.contractType?.includes('fullTime') || false },
  ]);

  const toggleSector = (id: string) => {
    setSectors(
      sectors.map((sector) =>
        sector.id === id
          ? { ...sector, selected: !sector.selected }
          : sector
      )
    );
  };

  const toggleContractType = (id: string) => {
    setContractTypes(
      contractTypes.map((type) =>
        type.id === id
          ? { ...type, selected: !type.selected }
          : type
      )
    );
  };

  const handleApplyFilters = () => {
    const filters: Filters = {
      sector: sectors.filter((s) => s.selected).map((s) => s.id),
      location,
      duration,
      contractType: contractTypes.filter((t) => t.selected).map((t) => t.id),
    };
    
    onApplyFilters(filters);
    onClose();
  };

  const handleResetFilters = () => {
    setSectors(sectors.map((s) => ({ ...s, selected: false })));
    setLocation('');
    setDuration('');
    setContractTypes(contractTypes.map((t) => ({ ...t, selected: false })));
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Filtres de recherche</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            {/* Sectors */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Secteur d'activité</Text>
              <View style={styles.optionsContainer}>
                {sectors.map((sector) => (
                  <TouchableOpacity
                    key={sector.id}
                    style={[
                      styles.optionButton,
                      sector.selected && styles.selectedOption,
                    ]}
                    onPress={() => toggleSector(sector.id)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        sector.selected && styles.selectedOptionText,
                      ]}
                    >
                      {sector.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Location */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Localisation</Text>
              <Input
                placeholder="Ville, région, etc."
                value={location}
                onChangeText={setLocation}
              />
            </View>

            {/* Duration */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Durée</Text>
              <Input
                placeholder="Ex: 3 mois, 6 mois, etc."
                value={duration}
                onChangeText={setDuration}
              />
            </View>

            {/* Contract Types */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Type de contrat</Text>
              <View style={styles.optionsContainer}>
                {contractTypes.map((type) => (
                  <TouchableOpacity
                    key={type.id}
                    style={[
                      styles.optionButton,
                      type.selected && styles.selectedOption,
                    ]}
                    onPress={() => toggleContractType(type.id)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        type.selected && styles.selectedOptionText,
                      ]}
                    >
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <Button
              title="Réinitialiser"
              variant="outline"
              onPress={handleResetFilters}
              style={styles.resetButton}
            />
            <Button
              title="Appliquer"
              onPress={handleApplyFilters}
              style={styles.applyButton}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: colors.background,
    borderTopLeftRadius: borderRadius.l,
    borderTopRightRadius: borderRadius.l,
    height: '85%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: typography.fontSizes.l,
    fontWeight: typography.fontWeights.semiBold,
    color: colors.text,
  },
  closeButton: {
    padding: spacing.s,
  },
  closeText: {
    fontSize: typography.fontSizes.xl,
    color: colors.muted,
  },
  content: {
    paddingHorizontal: spacing.m,
  },
  section: {
    marginVertical: spacing.m,
  },
  sectionTitle: {
    fontSize: typography.fontSizes.m,
    fontWeight: typography.fontWeights.semiBold,
    color: colors.text,
    marginBottom: spacing.s,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  optionButton: {
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
    borderRadius: borderRadius.m,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.s,
    marginBottom: spacing.s,
  },
  selectedOption: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  optionText: {
    fontSize: typography.fontSizes.s,
    color: colors.text,
  },
  selectedOptionText: {
    color: colors.white,
  },
  footer: {
    padding: spacing.m,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: 'row',
  },
  resetButton: {
    flex: 1,
    marginRight: spacing.s,
  },
  applyButton: {
    flex: 1,
    marginLeft: spacing.s,
  },
});

export default FilterModal; 