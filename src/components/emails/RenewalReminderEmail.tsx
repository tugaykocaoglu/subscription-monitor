import * as React from 'react';

interface RenewalReminderEmailProps {
  subscriptionName: string;
  amount: number;
  currency: string;
  renewDate: string;
}

export const RenewalReminderEmail: React.FC<
  Readonly<RenewalReminderEmailProps>
> = ({ subscriptionName, amount, currency, renewDate }) => (
  <div style={{ fontFamily: 'sans-serif', padding: '20px', color: '#333' }}>
    <h1 style={{ color: '#00a120' }}>Subscription Renewal Reminder</h1>
    <p>Hello,</p>
    <p>
      This is a reminder that your subscription for{' '}
      <strong>{subscriptionName}</strong> is renewing soon.
    </p>
    <div
      style={{
        backgroundColor: '#f4f4f4',
        padding: '15px',
        borderRadius: '8px',
        margin: '20px 0',
      }}
    >
      <p style={{ margin: '5px 0' }}>
        <strong>Amount:</strong> {amount} {currency}
      </p>
      <p style={{ margin: '5px 0' }}>
        <strong>Renewal Date:</strong> {renewDate}
      </p>
    </div>
    <p>
      You can manage your subscriptions and reminder settings in the SubMonitor
      dashboard.
    </p>
    <a
      href={`${
        process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
      }/dashboard`}
      style={{
        display: 'inline-block',
        backgroundColor: '#00a120',
        color: 'white',
        padding: '10px 20px',
        textDecoration: 'none',
        borderRadius: '5px',
        marginTop: '10px',
      }}
    >
      Go to Dashboard
    </a>
    <p style={{ marginTop: '30px', fontSize: '12px', color: '#777' }}>
      Sent by SubMonitor - Your subscription management assistant.
    </p>
  </div>
);
