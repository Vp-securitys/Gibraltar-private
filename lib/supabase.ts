import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!


export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Profile = {
  id: string
  user_id: string
  firstName:string
  lastName:string
  phoneNumber:string
  city?:string
  zipCode?:string
  country?:string
  address?:string
  state?:string
  full_name: string
  email: string
  access_code: string
  created_at: string
}

export type Account = {
  id: string
  user_id: string
  account_type: "Checking" | "Business"
  account_number: string
  balance: number
  created_at: string
}

export type Transaction = {
  id: string
  account_id: string
  user_id: string
  type: "Debit" | "Credit" | "Deposit"
  amount: number
  description: string
  status: "Completed" | "Pending" | "Failed"
  transaction_date: string
  related_deposit_id?: string
  related_transfer_id?: string
}

export type Deposit = {
  id: string
  user_id: string
  account_id: string
  amount: number
  front_image_url: string
  back_image_url: string
  status: "Pending" | "Approved" | "Rejected"
  submitted_at: string
  reviewed_at?: string
}

export type Transfer = {
  id: string
  user_id: string
  source_account_id: string
  recipient_name: string
  recipient_account_number: string
  recipient_routing_number: string
  amount: number
  memo?: string
  status: "Completed" | "Pending" | "Failed"
  created_at: string
}

export type Message = {
  id: string
  user_id: string
  subject: string
  body: string
  sender_type: "User" | "Support"
  sent_at: string
  is_read: boolean
}
