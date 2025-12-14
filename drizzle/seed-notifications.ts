import { config } from "dotenv";
config();

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { notifications, users } from "./schema";
import { eq } from "drizzle-orm";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

async function seedNotifications() {
  console.log("🌱 Seeding notifications...");

  try {
    // Get the first user (for testing)
    const userList = await db.select().from(users).limit(1);
    
    if (userList.length === 0) {
      console.log("❌ No users found. Please create a user first.");
      return;
    }

    const userId = userList[0].id;
    console.log(`✅ Found user with ID: ${userId}`);

    // Create sample notifications
    const sampleNotifications = [
      {
        userId,
        type: "project_update" as const,
        priority: "high" as const,
        title: "Project Milestone Completed",
        message: "The design phase of your E-commerce Platform project has been completed ahead of schedule!",
        link: "/client-portal/projects/1",
        actionType: "view" as const,
        actionUrl: "/client-portal/projects/1",
        actionLabel: "View Project",
        groupKey: "project_1_updates",
        read: false,
      },
      {
        userId,
        type: "message" as const,
        priority: "urgent" as const,
        title: "New Message from Project Manager",
        message: "Sarah Johnson sent you a message: 'Can we schedule a call to discuss the API integration?'",
        link: "/client-portal/messages",
        actionType: "respond" as const,
        actionUrl: "/client-portal/messages",
        actionLabel: "Reply",
        groupKey: null,
        read: false,
      },
      {
        userId,
        type: "invoice" as const,
        priority: "high" as const,
        title: "New Invoice Available",
        message: "Invoice #INV-2024-001 for $5,000.00 is ready for review and payment.",
        link: "/client-portal/invoices",
        actionType: "view" as const,
        actionUrl: "/client-portal/invoices",
        actionLabel: "View Invoice",
        groupKey: null,
        read: false,
      },
      {
        userId,
        type: "project_update" as const,
        priority: "medium" as const,
        title: "Project Status Update",
        message: "Your Mobile App Development project is now 65% complete. Next milestone: Beta Testing.",
        link: "/client-portal/projects/2",
        actionType: "view" as const,
        actionUrl: "/client-portal/projects/2",
        actionLabel: "View Progress",
        groupKey: "project_2_updates",
        read: false,
      },
      {
        userId,
        type: "ticket" as const,
        priority: "medium" as const,
        title: "Support Ticket Updated",
        message: "Your support ticket #TKT-001 has been updated. Our team has responded to your query.",
        link: "/client-portal/support",
        actionType: "view" as const,
        actionUrl: "/client-portal/support",
        actionLabel: "View Ticket",
        groupKey: null,
        read: false,
      },
      {
        userId,
        type: "system" as const,
        priority: "low" as const,
        title: "Welcome to HOPSTECH Client Portal",
        message: "Thank you for choosing HOPSTECH! Explore your dashboard to track projects, view invoices, and communicate with our team.",
        link: "/client-portal",
        actionType: "none" as const,
        actionUrl: null,
        actionLabel: null,
        groupKey: null,
        read: true,
      },
      {
        userId,
        type: "project_update" as const,
        priority: "urgent" as const,
        title: "Action Required: Review Deliverables",
        message: "3 new deliverables are ready for your review in the E-commerce Platform project.",
        link: "/client-portal/projects/1",
        actionType: "approve" as const,
        actionUrl: "/client-portal/projects/1",
        actionLabel: "Review Now",
        groupKey: "project_1_updates",
        read: false,
      },
      {
        userId,
        type: "message" as const,
        priority: "low" as const,
        title: "Team Update",
        message: "Your development team has shared the weekly progress report.",
        link: "/client-portal/messages",
        actionType: "view" as const,
        actionUrl: "/client-portal/messages",
        actionLabel: "Read Report",
        groupKey: null,
        read: true,
      },
    ];

    // Insert notifications
    for (const notification of sampleNotifications) {
      await db.insert(notifications).values(notification);
    }

    console.log(`✅ Successfully seeded ${sampleNotifications.length} notifications!`);
    console.log("📊 Notification breakdown:");
    console.log(`   - Unread: ${sampleNotifications.filter(n => !n.read).length}`);
    console.log(`   - Read: ${sampleNotifications.filter(n => n.read).length}`);
    console.log(`   - Urgent: ${sampleNotifications.filter(n => n.priority === 'urgent').length}`);
    console.log(`   - High: ${sampleNotifications.filter(n => n.priority === 'high').length}`);
    console.log(`   - Medium: ${sampleNotifications.filter(n => n.priority === 'medium').length}`);
    console.log(`   - Low: ${sampleNotifications.filter(n => n.priority === 'low').length}`);

  } catch (error) {
    console.error("❌ Error seeding notifications:", error);
    throw error;
  }
}

seedNotifications()
  .then(() => {
    console.log("✅ Notification seeding complete!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Notification seeding failed:", error);
    process.exit(1);
  });

