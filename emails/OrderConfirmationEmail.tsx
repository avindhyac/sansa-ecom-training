import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'

interface OrderItem {
  name: string
  quantity: number
  price: number
}

interface OrderConfirmationEmailProps {
  orderId: string
  customerName?: string
  customerEmail: string
  orderItems: OrderItem[]
  totalAmount: number
  orderDate: string
}

export default function OrderConfirmationEmail({
  orderId,
  customerName = 'Customer',
  customerEmail,
  orderItems,
  totalAmount,
  orderDate,
}: OrderConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Order Confirmation - Your order #{orderId} has been received!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <div style={logoContainer}>
              <div style={logo}>✨</div>
              <Heading style={logoText}>Ecommerce Store</Heading>
            </div>
          </Section>

          <Section style={content}>
            <div style={successBadge}>
              <span style={checkmark}>✓</span>
            </div>

            <Heading style={h1}>Order Confirmed!</Heading>

            <Text style={text}>
              Hi {customerName}, thank you for your order! We&apos;ve received your payment and your order is being processed.
            </Text>

            <Section style={orderInfoBox}>
              <div style={orderInfoRow}>
                <Text style={orderInfoLabel}>Order Number:</Text>
                <Text style={orderInfoValue}>#{orderId}</Text>
              </div>
              <div style={orderInfoRow}>
                <Text style={orderInfoLabel}>Order Date:</Text>
                <Text style={orderInfoValue}>{orderDate}</Text>
              </div>
              <div style={orderInfoRow}>
                <Text style={orderInfoLabel}>Email:</Text>
                <Text style={orderInfoValue}>{customerEmail}</Text>
              </div>
            </Section>

            <Heading style={h2}>Order Summary</Heading>

            <Section style={orderItemsBox}>
              {orderItems.map((item, index) => (
                <div key={index} style={orderItem}>
                  <div style={orderItemInfo}>
                    <Text style={orderItemName}>{item.name}</Text>
                    <Text style={orderItemQuantity}>Qty: {item.quantity}</Text>
                  </div>
                  <Text style={orderItemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
                </div>
              ))}

              <Hr style={itemsSeparator} />

              <div style={totalRow}>
                <Text style={totalLabel}>Total</Text>
                <Text style={totalValue}>${totalAmount.toFixed(2)}</Text>
              </div>
            </Section>

            <Section style={buttonContainer}>
              <Button
                style={button}
                href={`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}`}
              >
                View Order Details
              </Button>
            </Section>

            <Section style={infoBox}>
              <Heading style={infoHeading}>What&apos;s Next?</Heading>
              <Text style={infoText}>
                📦 <strong>Processing:</strong> We&apos;re preparing your order for shipment
              </Text>
              <Text style={infoText}>
                🚚 <strong>Shipping:</strong> You&apos;ll receive a tracking number once shipped
              </Text>
              <Text style={infoText}>
                📧 <strong>Updates:</strong> We&apos;ll email you at every step
              </Text>
            </Section>

            <Text style={text}>
              If you have any questions about your order, please don&apos;t hesitate to contact our support team.
            </Text>
          </Section>

          <Hr style={hr} />

          <Section style={footer}>
            <Text style={footerText}>
              © 2025 Ecommerce Store. All rights reserved.
            </Text>
            <Text style={footerText}>
              <Link href="#" style={footerLink}>Track Order</Link> · <Link href="#" style={footerLink}>Contact Support</Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: '#0A0A0A',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '600px',
}

const header = {
  padding: '24px',
  textAlign: 'center' as const,
}

const logoContainer = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '12px',
}

const logo = {
  fontSize: '32px',
  background: 'linear-gradient(135deg, #00A86B 0%, #7FD4A8 100%)',
  width: '48px',
  height: '48px',
  borderRadius: '12px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

const logoText = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#FFFFFF',
  margin: '0',
}

const content = {
  padding: '0 24px',
}

const successBadge = {
  width: '80px',
  height: '80px',
  background: 'linear-gradient(135deg, #00A86B 0%, #7FD4A8 100%)',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto 24px',
}

const checkmark = {
  fontSize: '48px',
  color: '#FFFFFF',
}

const h1 = {
  color: '#FFFFFF',
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '0 0 24px',
  textAlign: 'center' as const,
}

const h2 = {
  color: '#FFFFFF',
  fontSize: '20px',
  fontWeight: '600',
  margin: '32px 0 16px',
}

const text = {
  color: '#A0A0A0',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 0',
}

const orderInfoBox = {
  background: 'rgba(255, 255, 255, 0.05)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '16px',
  padding: '20px',
  margin: '24px 0',
}

const orderInfoRow = {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '12px',
}

const orderInfoLabel = {
  color: '#A0A0A0',
  fontSize: '14px',
  margin: '0',
}

const orderInfoValue = {
  color: '#FFFFFF',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0',
}

const orderItemsBox = {
  background: 'rgba(255, 255, 255, 0.05)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '16px',
  padding: '20px',
  margin: '16px 0 32px',
}

const orderItem = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: '16px',
}

const orderItemInfo = {
  flex: 1,
}

const orderItemName = {
  color: '#FFFFFF',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 4px',
}

const orderItemQuantity = {
  color: '#A0A0A0',
  fontSize: '14px',
  margin: '0',
}

const orderItemPrice = {
  color: '#00A86B',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0',
}

const itemsSeparator = {
  borderColor: 'rgba(255, 255, 255, 0.1)',
  margin: '16px 0',
}

const totalRow = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}

const totalLabel = {
  color: '#FFFFFF',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0',
}

const totalValue = {
  color: '#00A86B',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0',
}

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
}

const button = {
  backgroundColor: '#00A86B',
  borderRadius: '12px',
  color: '#FFFFFF',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 32px',
}

const infoBox = {
  background: 'rgba(0, 168, 107, 0.1)',
  border: '1px solid rgba(0, 168, 107, 0.2)',
  borderRadius: '16px',
  padding: '20px',
  margin: '32px 0',
}

const infoHeading = {
  color: '#FFFFFF',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 16px',
}

const infoText = {
  color: '#A0A0A0',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '8px 0',
}

const hr = {
  borderColor: 'rgba(255, 255, 255, 0.1)',
  margin: '32px 0',
}

const footer = {
  padding: '0 24px',
}

const footerText = {
  color: '#707070',
  fontSize: '14px',
  lineHeight: '20px',
  textAlign: 'center' as const,
  margin: '8px 0',
}

const footerLink = {
  color: '#00A86B',
  textDecoration: 'none',
}
