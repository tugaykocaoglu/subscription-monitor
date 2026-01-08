import * as React from 'react';

interface SubscriptionRenewedEmailProps {
  subscriptionName: string;
  amount: number;
  currency: string;
  previousDate: string;
  nextDate: string;
}

export const SubscriptionRenewedEmail: React.FC<
  Readonly<SubscriptionRenewedEmailProps>
> = ({ subscriptionName, amount, currency, previousDate, nextDate }) => (
  <div style={{ fontFamily: 'sans-serif', padding: '20px', color: '#333' }}>
    <h1 style={{ color: '#00a120' }}>Subscription Renewed</h1>
    <p>Hello,</p>
    <p>
      We've automatically updated the renewal date for{' '}
      <strong>{subscriptionName}</strong>.
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
        <strong>Renews On:</strong> {nextDate}
      </p>
      <p style={{ margin: '5px 0', fontSize: '0.9em', color: '#666' }}>
        Previous Date: {previousDate}
      </p>
    </div>

    <p>
      This ensures your dashboard stays up to date without any action needed
      from you.
    </p>

    <a
      href={`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard`}
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
      View Dashboard
    </a>
  </div>
);
