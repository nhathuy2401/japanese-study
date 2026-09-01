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
  const theme = settings?.currentTheme || colors.dark;

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
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.bgCanvas }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>CÀI ĐẶT ỨNG DỤNG</Text>
          <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
            Tùy biến hiển thị & Thiết lập Trợ giảng AI
          </Text>
        </View>

        {/* 1. GIAO DIỆN & MÀU SẮC (THEME MODE: SÁNG / TỐI) */}
        <Card style={[styles.sectionCard, { backgroundColor: theme.bgSurface, borderColor: theme.borderSubtle }]}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>GIAO DIỆN & MÀU SẮC</Text>
          <Text style={[styles.themeSubtitle, { color: theme.textTertiary }]}>
            Chọn tông màu hiển thị dịu mắt và phù hợp với thói quen học tập của bạn
          </Text>

          <View style={styles.themeGrid}>
            {/* Dark Mode Option Card */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => settings.setThemeMode('dark')}
              style={[
                styles.themeOptionCard,
                styles.themeDarkBg,
                settings.themeMode === 'dark' && styles.themeOptionActiveDark,
              ]}
            >
              <View style={styles.themeCardTop}>
                <Text style={styles.themeEmoji}>🌙</Text>
                <View style={styles.themeRadioCircle}>
                  {settings.themeMode === 'dark' && <View style={[styles.radioInner, { backgroundColor: '#F43F5E' }]} />}
                </View>
              </View>
              <Text style={styles.themeOptionTitleDark}>Chế độ Tối (Dark)</Text>
              <Text style={styles.themeOptionDescDark}>Đen sâu & Đỏ hoa anh đào Sakura (Mặc định)</Text>
              <View style={styles.colorPillsRow}>
                <View style={[styles.colorDot, { backgroundColor: '#0B0F17' }]} />
                <View style={[styles.colorDot, { backgroundColor: '#151D2A' }]} />
                <View style={[styles.colorDot, { backgroundColor: '#F43F5E' }]} />
              </View>
            </TouchableOpacity>

            {/* Light Mode Option Card */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => settings.setThemeMode('light')}
              style={[
                styles.themeOptionCard,
                styles.themeLightBg,
                settings.themeMode === 'light' && styles.themeOptionActiveLight,
              ]}
            >
              <View style={styles.themeCardTop}>
                <Text style={styles.themeEmoji}>☀️</Text>
                <View style={styles.themeRadioCircleLight}>
                  {settings.themeMode === 'light' && <View style={[styles.radioInner, { backgroundColor: '#D97706' }]} />}
                </View>
              </View>
              <Text style={styles.themeOptionTitleLight}>Chế độ Sáng (Light)</Text>
              <Text style={styles.themeOptionDescLight}>Trắng ngà & Vàng hổ phách dịu mắt</Text>
              <View style={styles.colorPillsRow}>
                <View style={[styles.colorDot, { backgroundColor: '#FAF8F5' }]} />
                <View style={[styles.colorDot, { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E7E0D3' }]} />
                <View style={[styles.colorDot, { backgroundColor: '#D97706' }]} />
              </View>
            </TouchableOpacity>
          </View>
        </Card>

        {/* 2. Adaptive Reading Modes (Chế độ đọc thích ứng) */}
        <Card style={[styles.sectionCard, { backgroundColor: theme.bgSurface, borderColor: theme.borderSubtle }]}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>CHẾ ĐỘ HIỂN THỊ FURIGANA</Text>
          <View style={styles.optionsList}>
            {furiganaOptions.map((opt) => {
              const isActive = settings.furiganaMode === opt.mode;
              return (
                <TouchableOpacity
                  key={opt.mode}
                  activeOpacity={0.7}
                  onPress={() => settings.setFuriganaMode(opt.mode)}
                  style={[
                    styles.optionRow,
                    { backgroundColor: theme.bgSubtle, borderColor: theme.borderSubtle },
                    isActive && { borderColor: theme.accent, backgroundColor: theme.accentBg },
                  ]}
                >
                  <View style={[styles.radioCircle, { borderColor: theme.textTertiary }]}>
                    {isActive && <View style={[styles.radioInner, { backgroundColor: theme.accent }]} />}
                  </View>
                  <View style={styles.optionInfo}>
                    <Text style={[styles.optionLabel, { color: theme.textPrimary }]}>{opt.label}</Text>
                    <Text style={[styles.optionDesc, { color: theme.textSecondary }]}>{opt.desc}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Romaji Switch */}
          <View style={[styles.switchRow, { borderTopColor: theme.borderSubtle }]}>
            <View style={styles.switchInfo}>
              <Text style={[styles.switchLabel, { color: theme.textPrimary }]}>Hiển thị chữ Latinh (Romaji)</Text>
              <Text style={[styles.switchDesc, { color: theme.textSecondary }]}>
                Tắt để tăng tốc độ ghi nhớ bảng chữ cái Kana
              </Text>
            </View>
            <Switch
              value={settings.showRomaji}
              onValueChange={(val) => settings.toggleRomaji(val)}
              trackColor={{ false: theme.borderSubtle, true: theme.accent }}
              thumbColor="#FFFFFF"
            />
          </View>
        </Card>

        {/* 3. Gemini AI Integration Setup */}
        <Card style={[styles.sectionCard, { backgroundColor: theme.bgSurface, borderColor: theme.borderSubtle }]}>
          <View style={styles.cardHeaderRow}>
            <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>TRỢ GIẢNG GEMINI AI</Text>
            <Switch
              value={settings.isAiEnabled}
              onValueChange={(val) => settings.toggleAi(val)}
              trackColor={{ false: theme.borderSubtle, true: theme.accent }}
              thumbColor="#FFFFFF"
            />
          </View>
          
          <Text style={[styles.aiPrivacyNote, { color: theme.textSecondary }]}>
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
            <Text style={[styles.advancedToggleText, { color: theme.accent }]}>
              {showAdvancedAi ? '▼ Ẩn cài đặt API key cá nhân' : '▶ Cấu hình API key cá nhân (Tùy chọn nâng cao)'}
            </Text>
          </TouchableOpacity>

          {showAdvancedAi && (
            <View style={[styles.advancedBox, { backgroundColor: theme.bgSubtle, borderColor: theme.borderSubtle }]}>
              {settings.isAiConfigured ? (
                <View style={styles.configuredBox}>
                  <View style={styles.keyBadge}>
                    <Text style={styles.keyBadgeDot}>●</Text>
                    <Text style={styles.keyBadgeText}>ĐÃ THIẾT LẬP KEY TRONG VÙNG BẢO MẬT</Text>
                  </View>
                  <Text style={[styles.maskedKeyText, { color: theme.textPrimary }]}>{settings.maskedApiKey}</Text>
                  
                  <View style={styles.keyActionsRow}>
                    <Button
                      title="Kiểm tra kết nối"
                      variant="outline"
                      size="sm"
                      loading={isTestingKey}
                      onPress={handleTestKey}
                    />
                    <Button
                      title="Xóa Key"
                      variant="danger"
                      size="sm"
                      onPress={handleRemoveKey}
                    />
                  </View>
                </View>
              ) : (
                <View style={styles.inputBox}>
                  <Text style={[styles.inputLabel, { color: theme.textPrimary }]}>Nhập Gemini API Key từ Google AI Studio:</Text>
                  <TextInput
                    style={[styles.keyInput, { backgroundColor: theme.bgSurface, color: theme.textPrimary, borderColor: theme.borderSubtle }]}
                    placeholder="Dán AIzaSy..."
                    placeholderTextColor={theme.textTertiary}
                    value={inputKey}
                    onChangeText={setInputKey}
                    autoCapitalize="none"
                    autoCorrect={false}
                    secureTextEntry
                  />
                  <View style={styles.saveBtnRow}>
                    <Button
                      title="Lưu Key Bảo Mật"
                      variant="primary"
                      size="md"
                      onPress={handleSaveKey}
                    />
                  </View>
                </View>
              )}
            </View>
          )}
        </Card>

        {/* 4. Feedback & Community */}
        <Card style={[styles.sectionCard, { backgroundColor: theme.bgSurface, borderColor: theme.borderSubtle }]}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>PHẢN HỒI & ĐÓNG GÓP Ý KIẾN</Text>
          <Text style={[styles.feedbackHint, { color: theme.textSecondary }]}>
            Gặp lỗi phát âm, từ vựng hoặc muốn góp ý tính năng mới? Chúng tôi luôn lắng nghe bạn.
          </Text>
          <Button
            title="💬 Gửi phản hồi / Báo lỗi"
            variant="outline"
            size="md"
            onPress={() => setShowFeedbackModal(true)}
            style={{ marginTop: 8 }}
          />
        </Card>
      </ScrollView>

      {/* Feedback Bottom Sheet Modal */}
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
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  sectionCard: {
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  themeSubtitle: {
    fontSize: 12,
    marginBottom: 14,
    lineHeight: 17,
  },
  themeGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  themeOptionCard: {
    flex: 1,
    padding: 14,
    borderRadius: 16,
    borderWidth: 2,
  },
  themeDarkBg: {
    backgroundColor: '#0B0F17',
    borderColor: '#243044',
  },
  themeLightBg: {
    backgroundColor: '#FAF8F5',
    borderColor: '#E7E0D3',
  },
  themeOptionActiveDark: {
    borderColor: '#F43F5E',
    shadowColor: '#F43F5E',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  themeOptionActiveLight: {
    borderColor: '#D97706',
    shadowColor: '#D97706',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  themeCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  themeEmoji: {
    fontSize: 24,
  },
  themeRadioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#64748B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeRadioCircleLight: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#A8A29E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeOptionTitleDark: {
    fontSize: 14,
    fontWeight: '800',
    color: '#F8FAFC',
    marginBottom: 4,
  },
  themeOptionDescDark: {
    fontSize: 11,
    color: '#94A3B8',
    lineHeight: 15,
  },
  themeOptionTitleLight: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1C1917',
    marginBottom: 4,
  },
  themeOptionDescLight: {
    fontSize: 11,
    color: '#78716C',
    lineHeight: 15,
  },
  colorPillsRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 12,
  },
  colorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  optionsList: {
    gap: 8,
    marginBottom: 14,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  optionInfo: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  optionDesc: {
    fontSize: 11,
    marginTop: 2,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
  },
  switchInfo: {
    flex: 1,
    marginRight: 12,
  },
  switchLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  switchDesc: {
    fontSize: 11,
    marginTop: 2,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  aiPrivacyNote: {
    fontSize: 12,
    lineHeight: 18,
    marginTop: 6,
    marginBottom: 10,
  },
  advancedToggle: {
    paddingVertical: 6,
  },
  advancedToggleText: {
    fontSize: 12,
    fontWeight: '700',
  },
  advancedBox: {
    marginTop: 10,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  configuredBox: {
    gap: 8,
  },
  keyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  keyBadgeDot: {
    color: '#10B981',
    fontSize: 10,
  },
  keyBadgeText: {
    color: '#10B981',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  maskedKeyText: {
    fontSize: 14,
    fontFamily: 'monospace',
    fontWeight: '600',
  },
  keyActionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
  },
  inputBox: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  keyInput: {
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    borderWidth: 1,
  },
  saveBtnRow: {
    marginTop: 4,
  },
  feedbackHint: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 6,
  },
});
