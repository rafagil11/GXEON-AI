# Jupiter Swap V2 API Analysis

## Response Contract Observations
- `transaction: null`: Indicates a quote-only request or failure to build.
- `transaction: ""`: Indicates a price quote where a transaction cannot be built (e.g., insufficient liquidity or pathing).
- `errorCode: 2`: Observed in router responses. 
  - Metis: Insufficient SOL for gas/fees.
  - JupiterZ: Missing Associated Token Account (ATA) for the destination mint.

## Recommendation
Always implement a strict typeguard before attempting to deserialize the `transaction` field to prevent runtime exceptions in the GXEON execution layer.