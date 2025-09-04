import { WhatsAppNotifier } from "../application/ports";

export class WaMeWhatsAppAdapter implements WhatsAppNotifier {
  constructor(private readonly phone: string) {}

  async notifyManager(message: string) {
    const text = encodeURIComponent(message);
    const url = `https://wa.me/${this.phone}?text=${text}`;
    if (typeof window !== "undefined") window.location.href = url;
  }
}
