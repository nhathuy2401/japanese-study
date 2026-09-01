import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TextInput, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { observer } from 'mobx-react-lite';
import { useSettingsStore } from '../../src/stores/StoreContext';
import { colors } from '../../src/theme/colors';
import { Card } from '../../src/components/Card';
import { Button } from '../../src/components/Button';
import { FeedbackModal } from '../../src/components/FeedbackModal';
import { geminiService } from '../../src/services/ai/gemini';
import { getGasBaseUrl } from '../../src/services/api/gasClient';
import { FuriganaMode } from '../../src/domain/entities/types';

export default observer(function SettingsScreen() {
  const settings = useSettingsStore();

  const [inputKey, setInputKey] = useState('');
  const [isTestingKey, setIsTestingKey] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showAdvancedAi, setShowAdvancedAi] = useState(false);

  const gasBaseUrl = getGasBaseUrl();
  const isGasConfigured = !!gasBaseUrl && gasBaseUrl.trim().length > 0;

  const handleSaveKey = async () => {
    if (!inputKey.trim()) {
      Alert.alert('Chưa nhập key', 'Vui lòng dán Google Gemini API key lấy từ AI Studio.');
      return;
    }
    await settings.setGeminiKey(inputKey);
    setInputKey('');
    Alert.alert('Thành công', 'Đã lưu Gemini API key vào vùng nhớ bảo mật Expo SecureStore!');
  };

  const handleTestKey = async () => {
    const keyToTest = inputKey.trim() || settings.geminiApiKey;
    if (!keyToTest) {
      Alert.alert('Không tìm thấy key', 'Vui lòng nhập API key trước khi kiểm tra.');
      return;
    }
    setIsTestingKey(true);
    const result = await geminiService.testConnection(keyToTest);
    setIsTestingKey(false);

    if (result.success) {
      Alert.alert('Kết nối thành công! 🎉', 'Gemini AI đã sẵn sàng hoạt động.');
    } else {
      Alert.alert('Kết nối thất bại ❌', result.message);
    }
  };

  const handleRemoveKey = async () => {
    Alert.alert(
      'Xóa API Key',
      'Bạn có chắc muốn xóa Gemini API Key khỏi thiết bị?',
      [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Xóa', style: 'destructive', onPress: () => settings.removeGeminiKey() },
      ]
    );
  };

  const furiganaOptions: { mode: FuriganaMode; label: string; desc: string }[] = [
    { mode: 'always', label: 'Luôn hiện', desc: 'Thích hợp cho Newbie mới bắt đầu' },
    { mode: 'tap-to-reveal', label: 'Chạm để hiện (Khuyên dùng)', desc: 'Rèn luyện trí nhớ chủ động (Active Recall)' },
    { mode: 'hidden', label: 'Ẩn hoàn toàn', desc: 'Dành cho trình độ N3-N2' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>CÀI ĐẶT ỨNG DỤNG</Text>
          <Text style={styles.headerSubtitle}>Tùy biến hiển thị & Thiết lập Trợ giảng AI</Text>
        </View>

        {/* 1. Adaptive Reading Modes (Chế độ đọc thích ứng) */}
        <Card style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>CHẾ ĐỘ HIỂN THỊ FURIGANA</Text>
          <View style={styles.optionsList}>
            {furiganaOptions.map((opt) => (
              <TouchableOpacity
                key={opt.mode}
                activeOpacity={0.7}
                onPress={() => settings.setFuriganaMode(opt.mode)}
                style={[
                  styles.optionRow,
                  settings.furiganaMode === opt.mode && styles.optionRowActive,
                ]}
              >
                <View style={styles.radioCircle}>
                  {settings.furiganaMode === opt.mode && <View style={styles.radioInner} />}
                </View>
                <View style={styles.optionInfo}>
                  <Text style={styles.optionLabel}>{opt.label}</Text>
                  <Text style={styles.optionDesc}>{opt.desc}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Romaji Switch */}
          <View style={styles.switchRow}>
            <View style={styles.switchInfo}>
              <Text style={styles.switchLabel}>Hiển thị chữ Latinh (Romaji)</Text>
              <Text style={styles.switchDesc}>Tắt để tăng tốc độ ghi nhớ bảng chữ cái Kana</Text>
            </View>
            <Switch
              value={settings.showRomaji}
              onValueChange={(val) => settings.toggleRomaji(val)}
              trackColor={{ false: '#334155', true: colors.accent }}
              thumbColor="#FFFFFF"
            />
          </View>
        </Card>

        {/* 2. Gemini AI Integration Setup */}
        <Card style={styles.sectionCard}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.sectionTitle}>TRỢ GIẢNG GEMINI AI</Text>
            <Switch
              value={settings.isAiEnabled}
              onValueChange={(val) => settings.toggleAi(val)}
              trackColor={{ false: '#334155', true: colors.accent }}
              thumbColor="#FFFFFF"
            />
          </View>
          
          <Text style={styles.aiPrivacyNote}>
            {isGasConfigured
              ? '✨ AI được kết nối an toàn qua Google Apps Script Serverless. Bạn có thể sử dụng tính năng giải thích sâu và chấm bài viết mà không cần tự nhập API key.'
              : 'Ứng dụng hoạt động 100% offline. Bạn có thể nhập Gemini API key cá nhân từ Google AI Studio hoặc cấu hình Google Apps Script Backend.'}
          </Text>

          {/* Advanced / Personal Key Dropdown Toggle */}
          <TouchableOpacity
            style={styles.advancedToggle}
            onPress={() => setShowAdvancedAi(!showAdvancedAi)}
            activeOpacity={0.7}
          >
            <Text style={styles.advancedToggleText}>
              {showAdvancedAi ? '▼ Ẩn cài đặt API key cá nhân' : '▶ Cấu hình API key cá nhân (Tùy chọn nâng cao)'}
            </Text>
          </TouchableOpacity>

          {showAdvancedAi && (
            <View style={styles.advancedBox}>
              {settings.isAiConfigured ? (
                <View style={styles.configuredBox}>
                  <Text style={styles.configuredLabel}>API Key cá nhân đang lưu:</Text>
                  <Text style={styles.maskedKey}>{settings.maskedApiKey}</Text>
                  <View style={styles.configuredActions}>
                    <Button
                      title="Kiểm tra kết nối"
                      variant="outline"
                      size="sm"
                      loading={isTestingKey}
                      onPress={handleTestKey}
                      style={styles.keyBtn}
                    />
                    <Button
                      title="Xóa Key"
                      variant="danger"
                      size="sm"
                      onPress={handleRemoveKey}
                      style={styles.keyBtn}
                    />
                  </View>
                </View>
              ) : (
                <View style={styles.keyInputBox}>
                  <TextInput
                    placeholder="Dán Gemini API Key cá nhân..."
                    placeholderTextColor="#64748B"
                    value={inputKey}
                    onChangeText={setInputKey}
                    secureTextEntry
                    style={styles.keyInput}
                  />
                  <View style={styles.keyInputActions}>
                    <Button
                      title="Lưu API Key"
                      variant="primary"
                      onPress={handleSaveKey}
                      style={styles.saveKeyBtn}
                    />
                    <Button
                      title="Test"
                      variant="outline"
                      loading={isTestingKey}
                      onPress={handleTestKey}
                      style={styles.testKeyBtn}
                    />
                  </View>
                </View>
              )}
            </View>
          )}

          <View style={styles.switchRow}>
            <View style={styles.switchInfo}>
              <Text style={styles.switchLabel}>Cho phép dùng qua 3G/4G/5G</Text>
              <Text style={styles.switchDesc}>Gửi câu hỏi AI qua dữ liệu di động</Text>
            </View>
            <Switch
              value={settings.allowAiMobileData}
              onValueChange={(val) => {
                settings.allowAiMobileData = val;
              }}
              trackColor={{ false: '#334155', true: colors.success }}
              thumbColor="#FFFFFF"
            />
          </View>
        </Card>

        {/* 3. Sensory Feedback & Haptics */}
        <Card style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>TRẢI NGHIỆM HỌC TẬP</Text>

          <View style={styles.switchRow}>
            <View style={styles.switchInfo}>
              <Text style={styles.switchLabel}>Phản hồi rung vật lý (Haptics)</Text>
              <Text style={styles.switchDesc}>Rung nhẹ khi chạm từ, đúng/sai câu đố</Text>
            </View>
            <Switch
              value={settings.hapticsEnabled}
              onValueChange={(val) => settings.setHapticsEnabled(val)}
              trackColor={{ false: '#334155', true: colors.accent }}
              thumbColor="#FFFFFF"
            />
          </View>
        </Card>

        {/* 4. Feedback & Community (Góp ý qua Google Sheets) */}
        <Card style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>HỖ TRỢ & PHẢN HỒI</Text>
          <Text style={styles.feedbackDesc}>
            Bạn gặp lỗi hoặc có ý tưởng tính năng mới? Hãy gửi góp ý trực tiếp đến nhóm phát triển.
          </Text>
          <Button
            title="Gửi góp ý & Báo lỗi 📝"
            variant="outline"
            onPress={() => setShowFeedbackModal(true)}
            style={styles.feedbackButton}
          />
        </Card>
      </ScrollView>

      {/* Feedback Modal */}
      <FeedbackModal
        visible={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
      />
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
  sectionCard: {
    backgroundColor: colors.dark.bgSurface,
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  optionsList: {
    gap: 8,
    marginBottom: 14,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dark.bgSubtle,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
  },
  optionRowActive: {
    borderColor: colors.accent,
    backgroundColor: 'rgba(244, 63, 94, 0.08)',
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#94A3B8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.accent,
  },
  optionInfo: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.dark.textPrimary,
  },
  optionDesc: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.dark.borderSubtle,
  },
  switchInfo: {
    flex: 1,
    marginRight: 10,
  },
  switchLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.dark.textPrimary,
  },
  switchDesc: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  aiPrivacyNote: {
    fontSize: 12,
    color: '#94A3B8',
    lineHeight: 17,
    marginBottom: 12,
  },
  advancedToggle: {
    paddingVertical: 6,
    marginBottom: 10,
  },
  advancedToggleText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.accent,
  },
  advancedBox: {
    marginTop: 4,
    marginBottom: 12,
  },
  configuredBox: {
    backgroundColor: colors.dark.bgSubtle,
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  configuredLabel: {
    fontSize: 11,
    color: '#94A3B8',
  },
  maskedKey: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.dark.textPrimary,
    marginVertical: 4,
  },
  configuredActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  keyBtn: {
    flex: 1,
  },
  keyInputBox: {
    marginBottom: 8,
  },
  keyInput: {
    backgroundColor: colors.dark.bgSubtle,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: colors.dark.textPrimary,
    fontSize: 13,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.dark.borderSubtle,
  },
  keyInputActions: {
    flexDirection: 'row',
    gap: 8,
  },
  saveKeyBtn: {
    flex: 3,
  },
  testKeyBtn: {
    flex: 1,
  },
  feedbackDesc: {
    fontSize: 12,
    color: '#94A3B8',
    lineHeight: 17,
    marginBottom: 12,
  },
  feedbackButton: {
    marginTop: 4,
  },
});
