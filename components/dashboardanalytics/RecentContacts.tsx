import {
  Badge,
} from "@/components/ui/badge";
import Image from "next/image";

// Define the TypeScript interface for contact items
interface Contact {
  id: number;
  name: string;
  avatar: string;           // path or URL to avatar image
  role: string;             // e.g. "Frontend Developer", "Product Manager"
  email: string;
  phone?: string;           // optional
  company?: string;
  lastContact: "Today" | "Yesterday" | "2 days ago" | "Last week" | string;
  status: "Active" | "Pending" | "Inactive";  // or you can use "Contacted", "Replied", etc.
}

// Sample data – feel free to replace with real data
const contactsData: Contact[] = [
  {
    id: 1,
    name: "Rajesh Kumar",
    avatar: "/images/avatars/avatar-01.jpg",
    role: "Senior Developer",
    email: "rajesh.k@techcorp.in",
    phone: "+91 98765 43210",
    company: "TechCorp India",
    lastContact: "Today",
    status: "Active",
  },
  {
    id: 2,
    name: "Priya Sharma",
    avatar: "/images/avatars/avatar-02.jpg",
    role: "UI/UX Designer",
    email: "priya.s@designhub.co",
    company: "DesignHub",
    lastContact: "Yesterday",
    status: "Pending",
  },
  {
    id: 3,
    name: "Amit Verma",
    avatar: "/images/avatars/avatar-03.jpg",
    role: "Marketing Head",
    email: "amit.v@marketpeak.in",
    phone: "+91 91234 56789",
    lastContact: "2 days ago",
    status: "Active",
  },
  {
    id: 4,
    name: "Sneha Patel",
    avatar: "/images/avatars/avatar-04.jpg",
    role: "Project Manager",
    email: "sneha.p@globalsoft.com",
    company: "GlobalSoft",
    lastContact: "Last week",
    status: "Inactive",
  },
  {
    id: 5,
    name: "Vikram Singh",
    avatar: "/images/avatars/avatar-05.jpg",
    role: "CTO",
    email: "vikram.s@innovate.io",
    lastContact: "Today",
    status: "Active",
  },
];

export default function RecentContacts() {
  return (
    <div className="overflow-hidden rounded-2xl  border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Latest Contacts
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-lg  border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            <svg
              className="stroke-current fill-white dark:fill-gray-800"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.29004 5.90393H17.7067"
                stroke=""
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M17.7075 14.0961H2.29085"
                stroke=""
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12.0826 3.33331C13.5024 3.33331 14.6534 4.48431 14.6534 5.90414C14.6534 7.32398 13.5024 8.47498 12.0826 8.47498C10.6627 8.47498 9.51172 7.32398 9.51172 5.90415C9.51172 4.48432 10.6627 3.33331 12.0826 3.33331Z"
                fill=""
                stroke=""
                strokeWidth="1.5"
              />
              <path
                d="M7.91745 11.525C6.49762 11.525 5.34662 12.676 5.34662 14.0959C5.34661 15.5157 6.49762 16.6667 7.91745 16.6667C9.33728 16.6667 10.4883 15.5157 10.4883 14.0959C10.4883 12.676 9.33728 11.525 7.91745 11.525Z"
                fill=""
                stroke=""
                strokeWidth="1.5"
              />
            </svg>
            Filter
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            See all
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {contactsData.map((contact) => (
          <div
            key={contact.id}
            className="flex items-center justify-between gap-4 rounded-lg border border-gray-100 p-3.5 hover:bg-gray-50/50 dark:border-gray-800 dark:hover:bg-white/[0.02]"
          >
            <div className="flex items-center gap-3 min-w-0">
             

              <div className="min-w-0">
                <p className="font-medium text-gray-800 truncate text-theme-sm dark:text-white/90">
                  {contact.name}
                </p>
                <p className="text-gray-500 truncate text-theme-xs dark:text-gray-400">
                  {contact.role} • {contact.company || contact.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 flex-shrink-0">
              <div className="hidden sm:block text-right">
                <p className="text-gray-500 text-theme-xs dark:text-gray-400">
                  Last contact
                </p>
                <p className="text-gray-700 text-theme-sm font-medium dark:text-gray-300">
                  {contact.lastContact}
                </p>
              </div>

              <Badge
                size="sm"
                variant={
                  contact.status === "Active"
                    ? "success"
                    : contact.status === "Pending"
                    ? "warning"
                    : "secondary"
                }
              >
                {contact.status}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}