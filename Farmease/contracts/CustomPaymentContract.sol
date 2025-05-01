// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract CustomPaymentContract is ReentrancyGuard, Ownable {
    struct PaymentTerms {
        uint256 amount;
        uint256 deadline;
        bool requiresEscrow;
        uint256 escrowPercentage;
        address paymentToken;
        bool installmentsAllowed;
        uint256 numberOfInstallments;
    }

    PaymentTerms public terms;
    uint256 public totalPaid;
    uint256 public installmentAmount;
    uint256 public installmentsPaid;
    bool public isCompleted;
    address public seller;
    address public buyer;

    event PaymentReceived(address from, uint256 amount, uint256 timestamp);
    event InstallmentPaid(address from, uint256 installmentNumber, uint256 amount, uint256 timestamp);
    event PaymentCompleted(uint256 totalAmount, uint256 timestamp);
    event EscrowReleased(uint256 amount, uint256 timestamp);

    constructor() {
        seller = owner();
    }

    function setPaymentTerms(
        uint256 _amount,
        uint256 _deadline,
        bool _requiresEscrow,
        uint256 _escrowPercentage,
        address _paymentToken,
        bool _installmentsAllowed,
        uint256 _numberOfInstallments
    ) external onlyOwner {
        require(_amount > 0, "Amount must be greater than 0");
        require(_deadline > block.timestamp, "Deadline must be in the future");
        require(_escrowPercentage <= 100, "Invalid escrow percentage");
        
        terms = PaymentTerms({
            amount: _amount,
            deadline: _deadline,
            requiresEscrow: _requiresEscrow,
            escrowPercentage: _escrowPercentage,
            paymentToken: _paymentToken,
            installmentsAllowed: _installmentsAllowed,
            numberOfInstallments: _numberOfInstallments
        });

        if (_installmentsAllowed) {
            require(_numberOfInstallments > 0, "Number of installments must be greater than 0");
            installmentAmount = _amount / _numberOfInstallments;
        }
    }

    function makePayment() external payable nonReentrant {
        require(!isCompleted, "Payment already completed");
        require(block.timestamp <= terms.deadline, "Payment deadline has passed");
        require(msg.value == terms.amount, "Incorrect payment amount");

        if (terms.requiresEscrow) {
            uint256 escrowAmount = (terms.amount * terms.escrowPercentage) / 100;
            uint256 sellerAmount = terms.amount - escrowAmount;
            
            payable(seller).transfer(sellerAmount);
            // Escrow amount remains in contract
        } else {
            payable(seller).transfer(msg.value);
        }

        totalPaid = terms.amount;
        isCompleted = true;
        buyer = msg.sender;

        emit PaymentReceived(msg.sender, msg.value, block.timestamp);
        emit PaymentCompleted(totalPaid, block.timestamp);
    }

    function makeInstallmentPayment() external payable nonReentrant {
        require(terms.installmentsAllowed, "Installments not allowed");
        require(!isCompleted, "Payment already completed");
        require(block.timestamp <= terms.deadline, "Payment deadline has passed");
        require(msg.value == installmentAmount, "Incorrect installment amount");
        require(installmentsPaid < terms.numberOfInstallments, "All installments paid");

        if (terms.requiresEscrow) {
            uint256 escrowAmount = (installmentAmount * terms.escrowPercentage) / 100;
            uint256 sellerAmount = installmentAmount - escrowAmount;
            
            payable(seller).transfer(sellerAmount);
            // Escrow amount remains in contract
        } else {
            payable(seller).transfer(msg.value);
        }

        installmentsPaid++;
        totalPaid += msg.value;
        
        if (installmentsPaid == terms.numberOfInstallments) {
            isCompleted = true;
            emit PaymentCompleted(totalPaid, block.timestamp);
        }

        emit InstallmentPaid(msg.sender, installmentsPaid, msg.value, block.timestamp);
    }

    function releaseEscrow() external onlyOwner {
        require(terms.requiresEscrow, "No escrow to release");
        require(isCompleted, "Payment not completed");
        
        uint256 escrowAmount = address(this).balance;
        require(escrowAmount > 0, "No escrow to release");
        
        payable(seller).transfer(escrowAmount);
        emit EscrowReleased(escrowAmount, block.timestamp);
    }

    function getPaymentTerms() external view returns (PaymentTerms memory) {
        return terms;
    }

    function getPaymentStatus() external view returns (
        uint256 _totalPaid,
        uint256 _installmentsPaid,
        bool _isCompleted
    ) {
        return (totalPaid, installmentsPaid, isCompleted);
    }
} 