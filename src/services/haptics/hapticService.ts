import * as Haptics from 'expo-haptics';

export class HapticService {
  private enabled = true;

  setEnabled(val: boolean) {
    this.enabled = val;
  }

  async light() {
    if (!this.enabled) return;
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
  }

  async medium() {
    if (!this.enabled) return;
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}
  }

  async success() {
    if (!this.enabled) return;
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {}
  }

  async warning() {
    if (!this.enabled) return;
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } catch {}
  }

  async error() {
    if (!this.enabled) return;
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } catch {}
  }
}

export const hapticService = new HapticService();
