# Integration Testing Checklist

Quick reference for manual testing in Postman.

## 🚀 Quick Start

```bash
# 1. Reset database
pnpm test:reset

# 2. Start all services
pnpm dev

# 3. Verify services (in new terminal)
pnpm test:smoke

# 4. Open Postman and import:
#    - postman_collection.json
#    - postman_environment.json
```

---

## ✅ Test Scenarios Checklist

### Scenario 1: User Flow (10 steps)
- [ ] Register new user
- [ ] Login user (save token)
- [ ] Get current user
- [ ] Browse products
- [ ] Get product details
- [ ] Add to cart (2 items)
- [ ] View cart
- [ ] Create order (save order_id)
- [ ] Verify cart is empty
- [ ] Add review

### Scenario 2: Admin Flow (4 steps)
- [ ] Login as admin (save admin_token)
- [ ] Create category
- [ ] Create product
- [ ] Update order status

### Scenario 3: Error Cases (5 tests)
- [ ] 401 - No token
- [ ] 403 - User tries admin endpoint
- [ ] 400 - Invalid email
- [ ] 400 - Missing fields
- [ ] 404 - Nonexistent resource

### Scenario 4: Edge Cases (6 tests)
- [ ] Empty cart order
- [ ] Insufficient stock
- [ ] Duplicate review
- [ ] Access other user's cart
- [ ] Review without purchase
- [ ] Invalid rating (out of range)

---

## 📝 Test Credentials

**Admin:**
- Email: `admin@example.com`
- Password: `Password123!`

**Regular Users:**
- 5 users with random emails
- All passwords: `Password123!`

**New User for Testing:**
- Email: `newuser@example.com`
- Password: `TestPassword123!`

---

## 🎯 Expected Results Summary

| Scenario | Steps | Expected Result |
|----------|-------|-----------------|
| User Flow | 10 | All 200/201, cart clears after order |
| Admin Flow | 4 | All 200/201, admin ops succeed |
| Error Cases | 5 | Proper 401/403/400/404 codes |
| Edge Cases | 6 | Business rules enforced |

---

## 🐛 Bug Reporting Template

If you find bugs, document them in TESTING_RESULTS.md:

```markdown
### Bug: [Short Description]

**Severity**: Critical / Major / Minor
**Service**: auth-service / products-service / etc.
**Endpoint**: POST /api/auth/login
**Steps to Reproduce**:
1. Step one
2. Step two

**Expected**: 200 OK with token
**Actual**: 500 Internal Server Error

**Error Message**:
```
[paste error]
```

**Fix Required**: [What needs to be fixed]
```

---

## ✨ Success Criteria

Testing is complete when:
- ✅ All 25 test cases pass
- ✅ All HTTP status codes match expected
- ✅ No critical bugs found
- ✅ Business rules properly enforced
- ✅ Screenshots captured (optional)
- ✅ TESTING_RESULTS.md updated
