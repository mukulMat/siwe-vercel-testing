<template>
  <div class="box">
  <div class="container">
   <center><h1> SIWE </h1></center>
    <div class="">
      <button id="connectWalletBtn" @click="connectwithWallet">
        Connect wallet
      </button>
    </div>
    <div>
      <button id="siweBtn" @click="signInWithEthereum">
        Sign-in with Ethereum
      </button>
    </div>
    <div>
      <button id="infoBtn" @click="sessionInformation">
        Get session information
      </button>
    </div>
    </div>
  </div>
</template>

<script>
import swal from "sweetalert";
import { ethers } from "ethers";
import { SiweMessage } from "siwe";
import { axios } from "axios";

/* Create SIWE Message */
async function createSiweMessage(address, statement) {
  const domain = window.location.host;
  const origin = window.location.origin;
  const { ethereum } = window;
  const backend_url = "http://localhost:5000";
  const res = await fetch(`${backend_url}/nonce`, {
    credentials: "include",
  });
  const message = new SiweMessage({
    domain,
    address,
    statement,
    uri: origin,
    version: "1",
    chainId: "1",
    nonce: await res.text(),
  });
  return message.prepareMessage();
}

export default {
  name: "Loginform",
  data() {
    return {
      domain: "",
      info: null,
      res: [],
      errors: [],
    };
  },
  async created() {
    try {
      const response = await axios.get(`http://localhost:5000/nonce`);
      this.res = response.data;
    } catch (e) {
      this.errors.push(e);
    }
  },
  async mounted() {
    console.log("nonceresponse", this.res);
    this.domain = window.location.host;
    console.log("domain", this.domain);

    const domain = window.location.host;
    const origin = window.location.origin;
    const { ethereum } = window;
    const backend_url = "http://localhost:5000";
  },

  methods: {
    async login() {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      let response = await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      await provider.getBlockNumber();
      let balance = await provider.getBalance("ethers.eth");
      ethers.utils.formatEther(balance);
      ethers.utils.parseEther("1.0");
    },
    /* connect with wallet */
    connectwithWallet() {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      provider
        .send("eth_requestAccounts", [])
        .catch(() => swal("user rejected request"));
    },
    /* sigin in with ethereum */
    async signInWithEthereum() {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      let response = await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const backend_url = "http://localhost:5000";

      const message = await createSiweMessage(
        await signer.getAddress(),
        "Sign in with Ethereum to the app."
      );
      const signature = await signer.signMessage(message);
      const res = await fetch(`${backend_url}/siginwithethereum`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message, signature }),
        credentials: "include",
      });
      console.log(await res.text());
      swal("Sigin in successfully");
    },

    /* connect with session information */
    async sessionInformation() {
      const backend_url = "http://localhost:5000";
      const res = await fetch(`${backend_url}/personal_info`, {
        credentials: "include",
      });
      // console.log(await res?.text());
      let responce = await res?.text();
      swal(responce).then(function() {
 //this.$router.push('/dashboard');
 window.location.href='/dashboard'
});;
    },
  },
};
</script>

<style>
button {
  background-color: #282828;
  width: 100%;
  color: white;
  padding: 15px;
  margin: 10px 0px;
  border: none;
  cursor: pointer;
  font-size: 20px;
}
input[type="text"],
input[type="password"] {
  width: 100%;
  margin: 8px 0;
  padding: 12px 20px;
  display: inline-block;
  border: 2px solid #282828;
  box-sizing: border-box;
}
button:hover {
  opacity: 0.7;
}
.cancelbtn {
  width: auto;
  padding: 10px 18px;
  margin: 10px 5px;
}

.container {
  padding: 30px;
  width: 420px;
  background-color: #efefef;
}
.box {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top:100px;
}
.loginlink {
  color: #ffffff;
  text-decoration: none;
}
div#login {
  margin-top: 100px;
}

.swal-text {
  font-size: 22px;
  color: #000000;
  font-weight: 400;
  letter-spacing: 0px;
}
.swal-button {
  background-color: #31342d;
  font-size: 20px;
}
</style>
