export const mockInbox = {
  contacts: [
    {
      id: "all",
      label: "All",
      type: "group" as const
    },
    {
      id: "luca",
      label: "Luca",
      unread: 2,
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=220&q=80"
    },
    {
      id: "maya",
      label: "Maya",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=220&q=80"
    },
    {
      id: "ethan",
      label: "Ethan",
      avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=220&q=80"
    },
    {
      id: "sophie",
      label: "Sophie",
      avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=220&q=80"
    }
  ],
  activeOrder: {
    title: "MSR Hubba NX Tent",
    orderId: "Order #KL-SS21",
    status: "In transit",
    deliveryLabel: "Estimated delivery",
    deliveryDate: "May 27, 2025",
    progress: 0.63,
    imageUrl: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=500&q=80"
  },
  threads: [
    {
      id: "luca-thread",
      name: "Luca R.",
      message: "Thanks! Is pickup still good for today?",
      time: "11:20",
      unread: 2,
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=220&q=80"
    },
    {
      id: "maya-thread",
      name: "Maya K.",
      message: "Can you do €200?",
      time: "Yesterday",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=220&q=80"
    },
    {
      id: "ethan-thread",
      name: "Ethan J.",
      message: "The guitar is still available?",
      time: "May 19",
      avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=220&q=80"
    },
    {
      id: "sophie-thread",
      name: "Sophie L.",
      message: "Perfect, payment sent!",
      time: "May 18",
      avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=220&q=80"
    }
  ]
};

export type InboxContact = (typeof mockInbox.contacts)[number];
export type InboxThread = (typeof mockInbox.threads)[number];
export type ActiveOrder = typeof mockInbox.activeOrder;
