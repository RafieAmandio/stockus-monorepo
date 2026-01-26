declare module 'midtrans-client' {
  interface SnapConfig {
    isProduction: boolean
    serverKey: string
    clientKey: string
  }

  interface TransactionDetails {
    order_id: string
    gross_amount: number
  }

  interface CustomerDetails {
    first_name?: string
    last_name?: string
    email?: string
    phone?: string
  }

  interface ItemDetails {
    id: string
    price: number
    quantity: number
    name: string
    brand?: string
    category?: string
    merchant_name?: string
  }

  interface TransactionParameter {
    transaction_details: TransactionDetails
    customer_details?: CustomerDetails
    item_details?: ItemDetails[]
    custom_field1?: string
    custom_field2?: string
    custom_field3?: string
  }

  interface TransactionResponse {
    token: string
    redirect_url: string
  }

  interface TransactionStatusResponse {
    transaction_status: string
    order_id: string
    gross_amount: string
    payment_type: string
    transaction_time: string
    transaction_id: string
    status_code: string
    status_message: string
    fraud_status?: string
    currency?: string
  }

  class Snap {
    constructor(config: SnapConfig)
    createTransaction(parameter: TransactionParameter): Promise<TransactionResponse>
    transaction: {
      status(orderId: string): Promise<TransactionStatusResponse>
    }
  }

  const midtransClient: {
    Snap: typeof Snap
  }

  export default midtransClient
  export { Snap, SnapConfig, TransactionParameter, TransactionResponse, TransactionStatusResponse }
}
