async function main() {
  const Contract = await ethers.getContractFactory("WarrantyNFT");
  const contract = await Contract.deploy();

  await contract.waitForDeployment();

  console.log("Contract deployed at:", contract.target);
}

main();
