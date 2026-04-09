#!/usr/bin/env bash
set -euo pipefail

# ============================================================
# LeadAI Platform — Seed Demo Data Script
# ============================================================

echo ""
echo "🌱 LeadAI Platform — Seeding Demo Data"
echo "======================================="
echo ""

# TODO: Implement database seeding for development/demo environment

# TODO: Seed demo tenant
# - Create tenant: { name: "Demo Corp", slug: "demo-corp", planType: "professional" }
echo "[ TODO ] Seed demo tenant..."

# TODO: Seed admin user
# - Create user: admin@demo.leadai.in / demo123
# - Role: tenant_admin
echo "[ TODO ] Seed admin user (admin@demo.leadai.in / demo123)..."

# TODO: Seed sample leads
# - Create 50 sample leads with varied statuses, sources, and AI scores
# - Include leads from: Facebook Ads, Google Ads, Manual, WhatsApp
echo "[ TODO ] Seed 50 sample leads..."

# TODO: Seed sample pipeline with stages
# - Create default pipeline: "Sales Pipeline"
# - Stages: Lead → Contacted → Qualified → Proposal Sent → Negotiation → Won/Lost
echo "[ TODO ] Seed default pipeline with stages..."

# TODO: Seed sample deals
# - Create 20 deals spread across pipeline stages
# - Include deal values between ₹10,000 and ₹5,00,000
echo "[ TODO ] Seed sample deals across pipeline stages..."

# TODO: Seed sample campaign
# - Create: "Welcome Sequence" (WhatsApp + Email drip)
# - Status: active
echo "[ TODO ] Seed sample welcome campaign..."

# TODO: Seed sample workflows
# - "New Lead Follow-up" — WhatsApp message on lead creation
# - "Deal Won Congratulations" — Email on deal won
echo "[ TODO ] Seed sample workflows..."

echo ""
echo "✅ Seeding complete (placeholder — implementation pending)"
echo ""
echo "Demo credentials:"
echo "  Email:    admin@demo.leadai.in"
echo "  Password: demo123"
echo ""
