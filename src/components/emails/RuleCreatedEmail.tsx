import * as React from 'react';

interface RuleCreatedEmailProps {
  daysBefore: number;
  channel: string;
  sendHour: string;
}

export const RuleCreatedEmail: React.FC<Readonly<RuleCreatedEmailProps>> = ({
  daysBefore,
  channel,
  sendHour,
}) => (
  <div style={{ fontFamily: 'sans-serif', padding: '20px', color: '#333' }}>
    <h1 style={{ color: '#00a120' }}>New Reminder Rule Created</h1>
    <p>Hello,</p>
    <p>
      You have successfully created a new reminder rule for your subscriptions.
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
        <strong>Days Before:</strong> {daysBefore}
      </p>
      <p style={{ margin: '5px 0' }}>
        <strong>Channel:</strong> {channel}
      </p>
      <p style={{ margin: '5px 0' }}>
        <strong>Send Time:</strong> {sendHour}
      </p>
    </div>
    <p>
      We will notify you based on this rule for all your active subscriptions.
    </p>
    <a
      href={`${
        process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
      }/settings`}
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
      Manage Settings
    </a>
    <p style={{ marginTop: '30px', fontSize: '12px', color: '#777' }}>
      Sent by SubMonitor - Your subscription management assistant.
    </p>
  </div>
);
