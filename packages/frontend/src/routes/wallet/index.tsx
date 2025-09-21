import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useWallet } from "../../providers/WalletProvider";
import * as nanocurrency from "nanocurrency";

// TODO: check if entered password is correct.
function Wallet() {
  const { wallet, isLoading, setPassword, createWallet, refetch } = useWallet();
  const navigate = useNavigate();

  const handleClick = async () => {
    try {
      console.log("button clicked");
      const pwd = (document.getElementById("pwd") as HTMLInputElement)?.value;
      if (!pwd) {
        alert("Please enter a password");
        return;
      }
      setPassword(pwd);

      if (!wallet) {
        const newWallet = await createWallet(await nanocurrency.generateSeed());
        console.log(newWallet);
        refetch();
      }

      navigate({ to: "/myclubs" });
    } catch (error) {
      console.error("Error creating wallet:", error);
      alert("Failed to create wallet. Please try again.");
    }
  };

  if (!isLoading) {
    if (!wallet) {
      return (
        <div
          style={{
            maxWidth: "400px",
            margin: "50px auto",
            padding: "20px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            backgroundColor: "#f9f9f9",
            textAlign: "center",
          }}
        >
          <h2 style={{ color: "#333", marginBottom: "20px" }}>Create Wallet</h2>
          <p style={{ color: "#666", marginBottom: "20px" }}>
            You don't have a wallet yet.
          </p>
          <input
            type='password'
            name='pwd'
            id='pwd'
            placeholder='Enter password'
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "15px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "16px",
            }}
          />
          <button
            onClick={handleClick}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontSize: "16px",
              cursor: "pointer",
            }}
            onMouseOver={(e) =>
              ((e.target as HTMLButtonElement).style.backgroundColor =
                "#0056b3")
            }
            onMouseOut={(e) =>
              ((e.target as HTMLButtonElement).style.backgroundColor =
                "#007bff")
            }
          >
            Create Wallet
          </button>
        </div>
      );
    } else {
      return (
        <div
          style={{
            maxWidth: "400px",
            margin: "50px auto",
            padding: "20px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            backgroundColor: "#f0f8ff",
            textAlign: "center",
          }}
        >
          <h2 style={{ color: "#28a745", marginBottom: "20px" }}>
            ✅ Wallet Ready
          </h2>
          <p style={{ color: "#666", marginBottom: "20px" }}>
            Enter your password to continue.
          </p>
          <input
            type='password'
            name='pwd'
            id='pwd'
            placeholder='Enter password'
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "15px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "16px",
            }}
          />
          <button
            onClick={handleClick}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontSize: "16px",
              cursor: "pointer",
            }}
            onMouseOver={(e) =>
              ((e.target as HTMLButtonElement).style.backgroundColor =
                "#1e7e34")
            }
            onMouseOut={(e) =>
              ((e.target as HTMLButtonElement).style.backgroundColor =
                "#28a745")
            }
          >
            Continue
          </button>
        </div>
      );
    }
  } else {
    return (
      <div
        style={{
          maxWidth: "400px",
          margin: "50px auto",
          padding: "20px",
          textAlign: "center",
        }}
      >
        <p style={{ color: "#666", fontSize: "18px" }}>Loading...</p>
      </div>
    );
  }
}

export const Route = createFileRoute("/wallet/")({
  component: Wallet,
});
