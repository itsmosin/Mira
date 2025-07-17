import { BigInt, Address, Bytes } from "@graphprotocol/graph-ts"
import { Transfer as TransferEvent } from "../generated/USDC/ERC20"
import { User, Transaction, AidDisbursement, ReputationScore, GlobalStats } from "../generated/schema"

export function handleTransfer(event: TransferEvent): void {
  let toAddress = event.params.to
  let fromAddress = event.params.from
  let value = event.params.value

  // Skip mint/burn transactions (from/to zero address)
  if (toAddress.equals(Address.zero()) || fromAddress.equals(Address.zero())) {
    return
  }

  // Load or create recipient user
  let user = User.load(toAddress.toHex())
  if (user == null) {
    user = new User(toAddress.toHex())
    user.address = toAddress
    user.totalReceived = BigInt.fromI32(0)
    user.totalTransactions = BigInt.fromI32(0)
    user.reputationScore = BigInt.fromI32(0)
    user.firstTransactionAt = event.block.timestamp
    user.isVerified = true // All users in our system are verified
    user.createdAt = event.block.timestamp
  }

  // Update user statistics
  user.totalReceived = user.totalReceived.plus(value)
  user.totalTransactions = user.totalTransactions.plus(BigInt.fromI32(1))
  user.lastTransactionAt = event.block.timestamp
  user.updatedAt = event.block.timestamp

  // Calculate reputation score based on activity
  user.reputationScore = calculateReputationScore(user)

  user.save()

  // Create transaction record
  let transaction = new Transaction(event.transaction.hash.toHex())
  transaction.hash = event.transaction.hash
  transaction.from = fromAddress
  transaction.to = user.id
  transaction.value = value
  transaction.timestamp = event.block.timestamp
  transaction.blockNumber = event.block.number
  transaction.isAidDisbursement = isAidDisbursement(fromAddress, value)

  transaction.save()

  // Create aid disbursement record if applicable
  if (transaction.isAidDisbursement) {
    let aidDisbursement = new AidDisbursement(event.transaction.hash.toHex())
    aidDisbursement.recipient = user.id
    aidDisbursement.amount = value
    aidDisbursement.sender = fromAddress
    aidDisbursement.purpose = getAidPurpose(value)
    aidDisbursement.timestamp = event.block.timestamp
    aidDisbursement.transaction = transaction.id
    aidDisbursement.reputationImpact = calculateReputationImpact(value)

    aidDisbursement.save()

    transaction.aidDisbursement = aidDisbursement.id
    transaction.save()
  }

  // Update global statistics
  updateGlobalStats(value, user.id)
}

function calculateReputationScore(user: User): BigInt {
  let baseScore = BigInt.fromI32(100)
  
  // Points for transaction frequency
  let transactionPoints = user.totalTransactions.times(BigInt.fromI32(10))
  
  // Points for total received amount (scaled down)
  let amountPoints = user.totalReceived.div(BigInt.fromI32(1000000)) // Divide by 1M to scale
  
  // Bonus for being active (having recent transactions)
  let activityBonus = BigInt.fromI32(0)
  if (user.lastTransactionAt.gt(BigInt.fromI32(0))) {
    activityBonus = BigInt.fromI32(50)
  }

  return baseScore.plus(transactionPoints).plus(amountPoints).plus(activityBonus)
}

function isAidDisbursement(fromAddress: Address, value: BigInt): boolean {
  // Consider transactions over 100 USDC as aid disbursements
  let aidThreshold = BigInt.fromI32(100).times(BigInt.fromI32(1000000)) // 100 * 10^6 (USDC has 6 decimals)
  return value.ge(aidThreshold)
}

function getAidPurpose(value: BigInt): string {
  let amount = value.div(BigInt.fromI32(1000000)) // Convert to human readable
  
  if (amount.ge(BigInt.fromI32(1000))) {
    return "Emergency Relief"
  } else if (amount.ge(BigInt.fromI32(500))) {
    return "Skills Development"
  } else if (amount.ge(BigInt.fromI32(200))) {
    return "Healthcare Support"
  } else {
    return "Basic Needs"
  }
}

function calculateReputationImpact(value: BigInt): BigInt {
  // Higher amounts have higher reputation impact
  return value.div(BigInt.fromI32(10000)) // Scale down the impact
}

function updateGlobalStats(transactionValue: BigInt, userId: string): void {
  let stats = GlobalStats.load("global")
  if (stats == null) {
    stats = new GlobalStats("global")
    stats.totalUsers = BigInt.fromI32(0)
    stats.totalTransactions = BigInt.fromI32(0)
    stats.totalValueTransferred = BigInt.fromI32(0)
    stats.totalAidDisbursed = BigInt.fromI32(0)
    stats.averageReputationScore = BigInt.fromI32(0)
  }

  stats.totalTransactions = stats.totalTransactions.plus(BigInt.fromI32(1))
  stats.totalValueTransferred = stats.totalValueTransferred.plus(transactionValue)
  
  if (isAidDisbursement(Address.zero(), transactionValue)) {
    stats.totalAidDisbursed = stats.totalAidDisbursed.plus(transactionValue)
  }

  stats.lastUpdated = BigInt.fromI32(Date.now())
  stats.save()
} 