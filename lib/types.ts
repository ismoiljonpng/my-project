// Типы базы данных AL-ABBOS.
// Совместимы с дженериком supabase-js: createClient<Database>().

export type Role = "client" | "courier" | "manager" | "admin";

export type OrderStatus =
  | "new"
  | "accepted"
  | "cooking"
  | "ready"
  | "courier_assigned"
  | "picked_up"
  | "delivering"
  | "delivered"
  | "confirmed"
  | "cancelled";

export type PaymentMethod = "cash" | "card" | "online";

export type Profile = {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  role: Role;
  location_id: string | null;
  created_at: string;
};

export type Location = {
  id: string;
  name: string;
  address: string;
  lat: number | null;
  lng: number | null;
  phone: string | null;
  work_hours: string | null;
  delivery_zone: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
};

export type MenuCategory = {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
};

export type MenuItem = {
  id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  is_available: boolean;
  is_popular: boolean;
  sort_order: number;
  created_at: string;
};

export type Promotion = {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  discount: string | null;
  starts_at: string | null;
  ends_at: string | null;
  is_active: boolean;
  created_at: string;
};

export type Banner = {
  id: string;
  image_url: string | null;
  title: string | null;
  link: string | null;
  position: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
};

export type Order = {
  id: string;
  user_id: string;
  location_id: string | null;
  courier_id: string | null;
  status: OrderStatus;
  total: number;
  delivery_address: string;
  lat: number | null;
  lng: number | null;
  phone: string;
  comment: string | null;
  payment_method: PaymentMethod;
  cancel_reason: string | null;
  created_at: string;
  updated_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  menu_item_id: string | null;
  name: string;
  price: number;
  qty: number;
  created_at: string;
};

export type Vacancy = {
  id: string;
  title: string;
  description: string | null;
  location_id: string | null;
  salary: string | null;
  is_active: boolean;
  created_at: string;
};

export type JobApplication = {
  id: string;
  vacancy_id: string | null;
  full_name: string;
  phone: string;
  message: string | null;
  created_at: string;
};

export type SiteContent = {
  id: string;
  key: string;
  value: unknown;
  created_at: string;
  updated_at: string;
};

type TableConfig<Row, Insert, Update> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      profiles: TableConfig<
        Profile,
        Partial<Profile> & Pick<Profile, "id">,
        Partial<Profile>
      >;
      locations: TableConfig<
        Location,
        Partial<Location> & Pick<Location, "name" | "address">,
        Partial<Location>
      >;
      menu_categories: TableConfig<
        MenuCategory,
        Partial<MenuCategory> & Pick<MenuCategory, "name" | "slug">,
        Partial<MenuCategory>
      >;
      menu_items: TableConfig<
        MenuItem,
        Partial<MenuItem> & Pick<MenuItem, "name" | "price">,
        Partial<MenuItem>
      >;
      promotions: TableConfig<
        Promotion,
        Partial<Promotion> & Pick<Promotion, "title">,
        Partial<Promotion>
      >;
      banners: TableConfig<Banner, Partial<Banner>, Partial<Banner>>;
      orders: TableConfig<
        Order,
        Partial<Order> &
          Pick<Order, "user_id" | "delivery_address" | "phone">,
        Partial<Order>
      >;
      order_items: TableConfig<
        OrderItem,
        Partial<OrderItem> &
          Pick<OrderItem, "order_id" | "name" | "price" | "qty">,
        Partial<OrderItem>
      >;
      vacancies: TableConfig<
        Vacancy,
        Partial<Vacancy> & Pick<Vacancy, "title">,
        Partial<Vacancy>
      >;
      job_applications: TableConfig<
        JobApplication,
        Partial<JobApplication> &
          Pick<JobApplication, "full_name" | "phone">,
        Partial<JobApplication>
      >;
      site_content: TableConfig<
        SiteContent,
        Partial<SiteContent> & Pick<SiteContent, "key">,
        Partial<SiteContent>
      >;
    };
    Views: Record<string, never>;
    Functions: {
      user_role: { Args: Record<string, never>; Returns: string };
      user_location_id: { Args: Record<string, never>; Returns: string };
      place_order: {
        Args: {
          p_location_id: string;
          p_delivery_address: string;
          p_phone: string;
          p_comment: string | null;
          p_payment_method: string;
          p_items: { id: string; qty: number }[];
        };
        Returns: string;
      };
    };
    Enums: Record<string, never>;
  };
};
