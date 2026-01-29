
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from '../db/schema';
import { jerseys } from '../db/schema';

const sqlite = new Database('dev.db');
const db = drizzle(sqlite, { schema });

async function main() {
  console.log('Starting full catalog seed (Drizzle)...');

  // --- 1. JERSEYS (10 items) ---
  const jerseyData = [
    { team: 'Arsenal', league: 'Premier League', image: 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/586e6806509e42cb8380486c91a42616_9366/Arsenal_24-25_Home_Jersey_Red_IT6141_21_model.jpg' },
    { team: 'Man Utd', league: 'Premier League', image: 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/0770cb13c66f43e59275a2ad07dd82a0_9366/Manchester_United_24-25_Home_Jersey_Red_IT2009_21_model.jpg' },
    { team: 'Real Madrid', league: 'La Liga', image: 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/f4bcc696773248558d9272304d9c748c_9366/Real_Madrid_24-25_Home_Jersey_White_IT5182_21_model.jpg' },
    { team: 'Barcelona', league: 'La Liga', image: 'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/9a95275e-63f8-4f90-8df3-5683b708cf8b/fc-barcelona-2024-25-stadium-home-dri-fit-soccer-jersey-gZ62Lg.png' },
    { team: 'Liverpool', league: 'Premier League', image: 'https://store.liverpoolfc.com/media/catalog/product/cache/419d803264426ac87a718357f4955d9d/h/v/hv0824.jpg' },
    { team: 'Juventus', league: 'Serie A', image: 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/2950550570534220977e891334c4f039_9366/Juventus_24-25_Home_Jersey_White_IT3589_21_model.jpg' },
    { team: 'Bayern Munich', league: 'Bundesliga', image: 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/116908976269436ca5ba664673d31fc1_9366/FC_Bayern_24-25_Home_Jersey_Red_IT2243_21_model.jpg' },
    { team: 'AC Milan', league: 'Serie A', image: 'https://images.footballfanatics.com/ac-milan/ac-milan-home-authentic-shirt-2024-25_ss5_p-200845348+u-kyg1uj8q4m2q9r7u36w5+v-j4n7v7w4n4n7v7w5.jpg?_hv=2&w=900' }, 
    { team: 'Inter Milan', league: 'Serie A', image: 'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/f_auto/dpr_1.0/h_700,c_limit/d1aa0648-5c4a-4318-aecc-63c3d526fc8e/inter-milan-2024-25-stadium-home-dri-fit-soccer-jersey-VqP59x.png' },
    { team: 'PSG', league: 'Ligue 1', image: 'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/7085c82e-8360-4785-b153-f77e68ad8629/psg-2024-25-stadium-home-dri-fit-soccer-jersey-zS4xkl.png' }
  ];

  for (const j of jerseyData) {
    await db.insert(jerseys).values({
      team: j.team,
      league: j.league,
      season: '2024/2025',
      type: 'Home',
      category: 'Jersey',
      price: 1250000,
      image: j.image,
      sizes: 'S,M,L,XL,XXL',
      stock: 50,
      stockData: JSON.stringify({ S:10, M:10, L:10, XL:10, XXL:10 })
    });
  }
  console.log('Added 10 Jerseys');

  // --- 2. SEPATU (10 items) ---
  const shoes = [
    { team: 'Nike Mercurial Vapor 15', brand: 'Nike', image: 'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_v1.75/951df983-49db-482e-b6a6-e81dbd413358/mercurial-superfly-9-elite-mercurial-dream-speed-fg-high-top-soccer-cleats-SB8gmk.png' },
    { team: 'Adidas Predator Elite', brand: 'Adidas', image: 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/c6c3df944436427382343a411130d704_9366/Predator_Elite_Firm_Ground_Soccer_Cleats_Black_IF6388_01_standard.jpg' },
    { team: 'Puma Future 7 Ultimate', brand: 'Puma', image: 'https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_600,h_600/global/107599/01/sv01/fnd/IDN/fmt/png/FUTURE-7-ULTIMATE-FG/AG-Men' },
    { team: 'Nike Phantom GX 2', brand: 'Nike', image: 'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/e609315c-1577-4598-a328-9174fe369a19/phantom-gx-2-academy-electric-mg-low-top-soccer-cleats-Kz3j4j.png' },
    { team: 'Adidas F50 Elite', brand: 'Adidas', image: 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/25916056586641e0a296719ee37b6408_9366/F50_Elite_Firm_Ground_Soccer_Cleats_White_IF1307_HM1.jpg' },
    { team: 'New Balance Tekela v4', brand: 'New Balance', image: 'https://nb.scene7.com/is/image/NB/st1fbb45_nb_02_i?$pdpflexf2$' },
    { team: 'Puma Ultra 5 Carbon', brand: 'Puma', image: 'https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_600,h_600/global/107720/01/sv01/fnd/IDN/fmt/png/ULTRA-5-CARBON-FG/AG-Soccer-Cleats' },
    { team: 'Adidas Copa Pure 2', brand: 'Adidas', image: 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/700863032588448ea92c575086d07525_9366/Copa_Pure_2_Elite_Firm_Ground_Soccer_Cleats_White_IE4977_22_model.jpg' },
    { team: 'Nike Tiempo Legend 10', brand: 'Nike', image: 'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/45099b6e-dcad-4176-b6d8-d65296839591/tiempo-legend-10-academy-mg-low-top-soccer-cleats-M251gD.png' },
    // Unsplash link removed. This seed file is deprecated/archived.
    // { team: 'Mizuno Morelia Neo III', brand: 'Mizuno', image: 'Placeholder' } 
  ];

  for (const s of shoes) {
    await db.insert(jerseys).values({
      team: s.team,
      league: s.brand,
      season: '-',
      type: 'Boot',
      category: 'Sepatu',
      price: 2800000,
      image: s.image,
      sizes: '39,40,41,42,43,44',
      stock: 30,
      stockData: JSON.stringify({ 40:5, 41:5, 42:5, 43:5 })
    });
  }
  console.log('Added 10 Shoes');

  // --- 3. WINDBREAKER (10 items) ---
  const jackets = [
    { team: 'Adidas Tiro 24 Windbreaker', brand: 'Adidas', image: 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/4f67641f715846fb8f3e1b73059da1c6_9366/Tiro_24_Windbreaker_Black_IR9339_21_model.jpg' },
    { team: 'Nike Repel Academy Jacket', brand: 'Nike', image: 'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/f153b8e7-e547-498c-914c-113527233633/repel-academy-mens-soccer-drill-top-ZgP37B.png' },
    { team: 'Puma TeamLIGA Jacket', brand: 'Puma', image: 'https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_600,h_600/global/657234/03/fnd/IDN/fmt/png/teamLIGA-All-Weather-Men' },
    { team: 'Man Utd Anthem Jacket', brand: 'Adidas', image: 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/f4757c91350047fb89b036573c734dcf_9366/Manchester_United_Anthem_Jacket_Black_IT2017_21_model.jpg' },
    { team: 'Liverpool Windrunner', brand: 'Nike', image: 'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/7d04a600-47ea-43c2-8032-9c176662e086/liverpool-fc-windrunner-mens-nike-full-zip-hooded-jacket-Mql0G9.png' },
    { team: 'Real Madrid Training Top', brand: 'Adidas', image: 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/532328471131464aa6a5039f9b57eef8_9366/Real_Madrid_Training_Top_White_IT5128_21_model.jpg' },
    { team: 'Arsenal Anthem Jacket', brand: 'Adidas', image: 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/3b121932314a4b53ba0faf5501062c94_9366/Arsenal_Anthem_Jacket_Blue_IT2196_21_model.jpg' },
    { team: 'PSG Windrunner', brand: 'Nike', image: 'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/f03c4013-5a04-4050-8919-ff16527ba7db/paris-saint-germain-windrunner-mens-full-zip-jacket-L3z1z9.png' },
    { team: 'Nike Storm-FIT Jacket', brand: 'Nike', image: 'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/fd17c427-4402-473d-9d48-64c8fd59273c/storm-fit-academy-mens-soccer-rain-jacket-D6g5qD.png' },
    { team: 'Adidas Tiro 23 League', brand: 'Adidas', image: 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/cf13f80c657545898d94af4900faec7d_9366/Tiro_23_League_Windbreaker_Black_HZ3007_21_model.jpg' }
  ];

  for (const w of jackets) {
    await db.insert(jerseys).values({
      team: w.team,
      league: w.brand,
      season: '-',
      type: 'Jacket',
      category: 'Windbreaker',
      price: 899000,
      image: w.image,
      sizes: 'S,M,L,XL',
      stock: 25,
      stockData: JSON.stringify({ M:10, L:10 })
    });
  }
  console.log('Added 10 Windbreakers');

  // --- 4. LAINNYA (10 items) ---
  const others = [
    { team: 'Premier League Strike Ball', brand: 'Nike', image: 'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/8bc03004-8b65-4f04-8314-e5950005786f/premier-league-strike-soccer-ball-XvC2jR.png' },
    { team: 'UCL Training Ball', brand: 'Adidas', image: 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/d409945037eb4305886270fc644cc5d0_9366/UCL_Training_Ball_White_IX4062_01_standard.jpg' },
    { team: 'Liverpool FC Scarf', brand: 'LFC', image: 'https://store.liverpoolfc.com/media/catalog/product/cache/419d803264426ac87a718357f4955d9d/a/1/a13320.jpg' },
    { team: 'Man Utd Beanie', brand: 'Adidas', image: 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/3579895055374431945aaf0400f60741_9366/Manchester_United_Beanie_Red_IB4599_01_standard.jpg' },
    { team: 'Nike Mercurial Lite Shinguard', brand: 'Nike', image: 'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/0b704943-43c3-4c9f-b3a2-11119762194f/mercurial-lite-soccer-shinguards-jDnmP5.png' },
    { team: 'Adidas Captain Armband', brand: 'Adidas', image: 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/f44da5a4561042738221a7f60045f2be_9366/Football_Captain_Armband_Black_CF1051_01_standard.jpg' },
    { team: 'Puma Team Final Socks', brand: 'Puma', image: 'https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_600,h_600/global/705310/01/fnd/IDN/fmt/png/teamFINAL-Socks' },
    { team: 'Nike Shoebag', brand: 'Nike', image: 'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/0e5b7c25-1e37-4d78-9a67-628d052aefff/academy-soccer-shoe-bag-pX86pG.png' },
    { team: 'Real Madrid Cap', brand: 'Adidas', image: 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/c90a16314c4740e59178af640109a272_9366/Real_Madrid_Baseball_Cap_Blue_IL3335_01_standard.jpg' },
    { team: 'Goalkeeper Gloves Predator', brand: 'Adidas', image: 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/3592751508244e68846faf49010098f9_9366/Predator_Pro_Goalkeeper_Gloves_Black_HN3345_01_standard.jpg' }
  ];

  for (const o of others) {
    await db.insert(jerseys).values({
      team: o.team,
      league: o.brand,
      season: '-',
      type: 'Accessory',
      category: 'Produk Lainnya',
      price: 199000,
      image: o.image,
      sizes: 'One Size',
      stock: 100,
      stockData: JSON.stringify({ "One Size": 20 })
    });
  }
  console.log('Added 10 Accessories');
}

main()
  .then(() => {
    console.log('Seed completed.');
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
