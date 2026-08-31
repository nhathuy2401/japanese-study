import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { observer } from 'mobx-react-lite';
import { colors } from '../../src/theme/colors';
import { PitchVisualizer } from '../../src/components/PitchVisualizer';
import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { hapticService } from '../../src/services/haptics/hapticService';
import { useProgressStore } from '../../src/stores/StoreContext';
import { PitchPattern } from '../../src/domain/entities/types';

export default observer(function PitchLabScreen() {
  const router = useRouter();
  const progress = useProgressStore();

  const [isPlayingNative, setIsPlayingNative] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);

  const samplePattern: PitchPattern = {
    type: 'nakadaka',
    pitchNumber: 2,
    moras: [
      { mora: 'こ', isHigh: false, number: 1 },
      { mora: 'れ', isHigh: true, number: 2 },
      { mora: 'を', isHigh: false, number: 3 },
      { mora: 'く', isHigh: false, number: 4 },
      { mora: 'だ', isHigh: true, number: 5 },
      { mora: 'さ', isHigh: false, number: 6 },
      { mora: 'い', isHigh: false, number: 7 },
    ],
  };

  const handlePlayNative = () => {
    hapticService.light();
    setIsPlayingNative(true);
    setTimeout(() => {
      setIsPlayingNative(false);
    }, 1500);
  };

  const handleToggleRecord = () => {
    if (!isRecording) {
      hapticService.medium();
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        setHasRecorded(true);
        hapticService.success();
      }, 2500);
    }
  };

  const handleSelfScore = (score: number) => {
    hapticService.success();
    progress.completeQuest('quest-2');
    Alert.alert('Đã lưu kết quả luyện âm!', 'Bạn đã hoàn thành nhiệm vụ Shadowing hôm nay (+15 XP)!', [
      { text: 'Xong', onPress: () => router.back() },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>LUYỆN PITCH ACCENT & SHADOWING</Text>
          <Text style={styles.headerSubtitle}>
            Nghe nhịp Mora ➔ Quan sát đường cao độ ➔ Thu âm đối chiếu
          </Text>
        </View>

        {/* Target Sentence */}
        <Card style={styles.targetCard}>
          <Text style={styles.cardLabel}>CÂU MỤC TIÊU:</Text>
          <Text style={styles.targetJp}>これ を ください。</Text>
          <Text style={styles.targetReading}>ko-re o ku-da-sa-i (7 Moras)</Text>
          <Text style={styles.targetVi}>💬 "Xin hãy cho tôi cái này."</Text>
        </Card>

        {/* Pitch Accent Contour Visualizer */}
        <View style={styles.sectionBox}>
          <Text style={styles.sectionHeader}>BIỂU ĐỒ CAO ĐỘ CHUẨN (PITCH ACCENT):</Text>
          <PitchVisualizer pattern={samplePattern} />
        </View>

        {/* Native Audio Controls */}
        <Card style={styles.audioCard}>
          <Text style={styles.sectionHeader}>AUDIO MẪU NGƯỜI BẢN XỨ:</Text>
          <View style={styles.audioControlsRow}>
            <Button
              title={isPlayingNative ? '🔊 Đang phát...' : '▶ Nghe mẫu'}
              variant="accent"
              onPress={handlePlayNative}
              style={styles.playBtn}
            />
            <TouchableOpacity
              style={styles.speedBtn}
              onPress={() => setPlaybackSpeed((prev) => (prev === 1.0 ? 0.8 : 1.0))}
            >
              <Text style={styles.speedBtnText}>{playbackSpeed}x Tốc độ</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Recording Lab */}
        <Card style={styles.recordingCard}>
          <Text style={styles.sectionHeader}>BẢN THU ÂM CỦA BẠN:</Text>

          <View style={styles.waveformContainer}>
            <Text style={styles.waveformGraphic}>
              {isRecording
                ? ' ▃▅▇█▇▆▅▃ ▂▃▅▇█▇▆▅▃ (Đang thu âm...)'
                : hasRecorded
                ? ' ▂▃▅▇█▇▆▅▃ ▂▃▅ (Đã thu xong)'
                : '⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯'}
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.recordButton, isRecording && styles.recordButtonActive]}
            onPress={handleToggleRecord}
          >
            <Text style={styles.recordButtonText}>
              {isRecording ? '⏹ Dừng thu âm' : '🎙️ Bấm để Thu âm phát âm'}
            </Text>
          </TouchableOpacity>

          {hasRecorded && (
            <View style={styles.evaluationBox}>
              <Text style={styles.evaluationHeader}>TỰ ĐÁNH GIÁ ĐỐI CHIẾU:</Text>
              <View style={styles.evalButtonsRow}>
                <TouchableOpacity
                  style={[styles.evalBtn, { borderColor: colors.danger }]}
                  onPress={() => handleSelfScore(1)}
                >
                  <Text style={styles.evalEmoji}>😟</Text>
                  <Text style={styles.evalText}>Chưa giống</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.evalBtn, { borderColor: colors.warning }]}
                  onPress={() => handleSelfScore(2)}
                >
                  <Text style={styles.evalEmoji}>😊</Text>
                  <Text style={styles.evalText}>Khá ổn</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.evalBtn, { borderColor: colors.success }]}
                  onPress={() => handleSelfScore(3)}
                >
                  <Text style={styles.evalEmoji}>🌟</Text>
                  <Text style={styles.evalText}>Rất chuẩn</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.dark.bgCanvas,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.dark.textPrimary,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  targetCard: {
    backgroundColor: colors.dark.bgSurface,
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  targetJp: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.dark.textPrimary,
    marginVertical: 4,
  },
  targetReading: {
    fontSize: 13,
    color: colors.accent,
    fontWeight: '600',
  },
  targetVi: {
    fontSize: 13,
    color: colors.dark.textSecondary,
    marginTop: 6,
  },
  sectionBox: {
    marginBottom: 14,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  audioCard: {
    backgroundColor: colors.dark.bgSurface,
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
  },
  audioControlsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  playBtn: {
    flex: 2,
  },
  speedBtn: {
    flex: 1,
    backgroundColor: colors.dark.bgSubtle,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.dark.borderSubtle,
  },
  speedBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.dark.textPrimary,
  },
  recordingCard: {
    backgroundColor: colors.dark.bgSurface,
    borderRadius: 18,
    padding: 16,
  },
  waveformContainer: {
    backgroundColor: colors.dark.bgSubtle,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    minHeight: 60,
  },
  waveformGraphic: {
    fontSize: 13,
    color: colors.accent,
    fontWeight: '700',
  },
  recordButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginVertical: 4,
  },
  recordButtonActive: {
    backgroundColor: colors.danger,
  },
  recordButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  evaluationBox: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.dark.borderSubtle,
  },
  evaluationHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
    marginBottom: 10,
    textAlign: 'center',
  },
  evalButtonsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  evalBtn: {
    flex: 1,
    backgroundColor: colors.dark.bgSubtle,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  evalEmoji: {
    fontSize: 22,
    marginBottom: 4,
  },
  evalText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.dark.textPrimary,
  },
});

