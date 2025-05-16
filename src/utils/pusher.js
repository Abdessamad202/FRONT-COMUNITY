// src/utils/ably.js
import Ably from 'ably';

const ably = new Ably.Realtime({
  key: 'NqC5Tg.0MTl-w:RrqORZNaZYEFtFUctuH62I5hq9Z1He4uGlohBEPNt7A', // Avoid hardcoding; use environment variables
});

export default ably;