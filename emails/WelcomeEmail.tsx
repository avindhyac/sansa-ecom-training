import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'

interface WelcomeEmailProps {
  userName?: string
  userEmail: string
}

export default function WelcomeEmail({
  userName = 'there',
  userEmail,
}: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to Ecommerce Store - Start Shopping Today!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <div style={logoContainer}>
              <div style={logo}>✨</div>
              <Heading style={logoText}>Ecommerce Store</Heading>
            </div>
          </Section>

          <Section style={content}>
            <Heading style={h1}>Welcome, {userName}! 🎉</Heading>

            <Text style={text}>
              Thanks for joining Ecommerce Store! We&apos;re thrilled to have you as part of our community.
            </Text>

            <Text style={text}>
              Your account has been successfully created with the email: <strong>{userEmail}</strong>
            </Text>

            <Section style={featuresBox}>
              <Heading style={h2}>What you can do now:</Heading>

              <div style={feature}>
                <span style={featureIcon}>🛍️</span>
                <div>
                  <Text style={featureTitle}>Browse Premium Products</Text>
                  <Text style={featureDesc}>Explore our curated collection of high-quality items</Text>
                </div>
              </div>

              <div style={feature}>
                <span style={featureIcon}>💳</span>
                <div>
                  <Text style={featureTitle}>Secure Checkout</Text>
                  <Text style={featureDesc}>Shop with confidence using our encrypted payment system</Text>
                </div>
              </div>

              <div style={feature}>
                <span style={featureIcon}>🚀</span>
                <div>
                  <Text style={featureTitle}>Fast Delivery</Text>
                  <Text style={featureDesc}>Get your orders delivered quickly and reliably</Text>
                </div>
              </div>
            </Section>

            <Section style={buttonContainer}>
              <Button style={button} href={process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}>
                Start Shopping
              </Button>
            </Section>

            <Text style={text}>
              If you have any questions, feel free to reach out to our support team.
            </Text>
          </Section>

          <Hr style={hr} />

          <Section style={footer}>
            <Text style={footerText}>
              © 2025 Ecommerce Store. All rights reserved.
            </Text>
            <Text style={footerText}>
              <Link href="#" style={footerLink}>Unsubscribe</Link> · <Link href="#" style={footerLink}>Privacy Policy</Link>
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

const h1 = {
  color: '#FFFFFF',
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '32px 0 24px',
  textAlign: 'center' as const,
}

const h2 = {
  color: '#FFFFFF',
  fontSize: '20px',
  fontWeight: '600',
  margin: '0 0 16px',
}

const text = {
  color: '#A0A0A0',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 0',
}

const featuresBox = {
  background: 'rgba(255, 255, 255, 0.05)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '16px',
  padding: '24px',
  margin: '32px 0',
}

const feature = {
  display: 'flex',
  gap: '16px',
  alignItems: 'flex-start',
  marginBottom: '20px',
}

const featureIcon = {
  fontSize: '24px',
  marginTop: '4px',
}

const featureTitle = {
  color: '#FFFFFF',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 4px',
}

const featureDesc = {
  color: '#A0A0A0',
  fontSize: '14px',
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
