# 🦊 MetaMask Setup Guide - Fix Connection Issues

## 🚨 **Quick Fix for Your Current Issue**

### **Problem:** "Failed to authenticate to MetaMask" Error
**Root Cause:** MetaMask not connected to local Ganache blockchain

---

## ✅ **Step-by-Step Solution**

### **Step 1: Start Ganache Blockchain**
```bash
# In Terminal 1:
npm run ganache

# Wait for: "Listening on 127.0.0.1:7545"
```

### **Step 2: Configure MetaMask Network**

#### **A. Add Ganache Network to MetaMask:**
1. Open MetaMask extension
2. Click network dropdown (top center)
3. Click "Add Network" → "Add a network manually"
4. Enter EXACTLY these values:

```
Network Name: Ganache Local
New RPC URL: http://127.0.0.1:7545
Chain ID: 1337
Currency Symbol: ETH
Block Explorer URL: (leave empty)
```

5. Click "Save"

#### **B. Switch to Ganache Network:**
1. Click network dropdown
2. Select "Ganache Local"
3. ✅ You should see "Ganache Local" at the top

### **Step 3: Import Test Account**
1. In MetaMask: Account menu → "Import Account"
2. Select "Private Key"
3. Paste this private key:
```
0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d
```
4. Click "Import"
5. ✅ You should see ~99.99 ETH balance

### **Step 4: Deploy Contracts**
```bash
# In Terminal 2:
npm run compile
npm run migrate
```

### **Step 5: Start Server**
```bash
# In same Terminal 2:
npm start
```

---

## 🌐 **Network Access Setup**

### **Your IP Address:** `10.82.102.78`

#### **For Phone Access:**
1. **Connect phone to same WiFi**
2. **Open browser on phone**
3. **Visit:** `http://10.82.102.78:3000`

#### **For Computer:**
- **Visit:** `http://localhost:3000`

---

## 🔧 **Troubleshooting Common Issues**

### **Issue 1: "Network Error" or "Failed to Connect"**
**Solution:**
```bash
# Kill any existing processes
tasklist | findstr node
# Kill any Node processes if found

# Restart fresh
npm run ganache  # Terminal 1
npm run migrate  # Terminal 2  
npm start        # Terminal 2
```

### **Issue 2: Phone Can't Access Network**
**Solutions:**
1. **Check Windows Firewall:**
   - Windows Settings → Update & Security → Windows Security
   - Firewall & network protection → Allow an app through firewall
   - Add Node.js if not listed

2. **Alternative Network URLs to try:**
   - `http://10.82.102.78:3000`
   - `http://localhost:3000` (if on same computer)

### **Issue 3: MetaMask Shows Wrong Network**
**Solution:**
1. Click MetaMask network dropdown
2. Select "Ganache Local" 
3. If not visible, re-add the network with exact settings above

### **Issue 4: "Insufficient Funds" Error**
**Solution:**
1. Make sure you imported the test account (Step 3 above)
2. Check you're on "Ganache Local" network
3. Should show ~99.99 ETH balance

---

## 📱 **Mobile MetaMask Setup**

### **Install MetaMask Mobile:**
1. Download MetaMask app from Play Store/App Store
2. Import using same private key:
```
0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d
```

### **Add Network in Mobile MetaMask:**
1. Settings → Networks → Add Network
2. Use same settings as desktop version above

---

## 🎯 **Quick Test Checklist**

Before opening the app, verify:
- ✅ Ganache running (Terminal 1 shows "Listening on 127.0.0.1:7545")
- ✅ MetaMask on "Ganache Local" network
- ✅ Test account imported with ~99.99 ETH
- ✅ Contracts deployed (`npm run migrate` completed)
- ✅ Server running (`npm start` shows server started)
- ✅ Network access (phone connected to same WiFi)

---

## 🚀 **Expected Result**

When everything is working:
- **Computer:** http://localhost:3000 → Shows voting interface
- **Phone:** http://10.82.102.78:3000 → Shows voting interface
- **MetaMask:** Connects automatically, shows account address
- **Voting:** Can select candidates and cast votes

---

## 📞 **Still Having Issues?**

### **Most Common Fix:**
1. **Restart everything:** Close all terminals
2. **Run:** `quick-setup.bat` (creates proper setup sequence)
3. **Wait:** For Ganache to fully start
4. **Then:** Follow steps above in order

### **Emergency Reset:**
```bash
# Nuclear option - start completely fresh
rm -rf node_modules
npm install
# Then follow setup steps above
```

**This should resolve your MetaMask authentication and network access issues! 🎉**
