import * as React from 'react';
import './generic.css';

export const GenericTemplate: React.FC = ({ children }) => (
  <>
    <nav className="navigation">
      <a href="https://effector.now.sh">Effector</a>
      <a href="https://github.com/sergeysova/laBALLatory">Source Code</a>
    </nav>
    <main>{children}</main>
  </>
);
