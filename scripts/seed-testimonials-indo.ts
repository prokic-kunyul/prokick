
import { db } from '@/lib/db'
import { testimonials } from '@/db/schema'

const indoTestimonials = [
  { name: 'Budi Santoso', role: 'Fans MU', content: 'Varian jersey MU-nya lengkap banget min! Bahannya adem, enak dipake futsal. Pengiriman cepet sampe Jogja.', rating: 5 },
  { name: 'Siti Aminah', role: 'Pembeli', content: 'Suka banget sama pelayanan adminnya, ramah pol. Nanya size chart dijelasin detail. Barangnya ori grade premium.', rating: 5 },
  { name: 'Rizky Pratama', role: 'Kolektor Jersey', content: 'Gila sih detailnya, mirip banget sama yang player issue. Badge-nya juga rapi. Fix langganan disini.', rating: 5 },
  { name: 'Dewi Sartika', role: 'Ibu Rumah Tangga', content: 'Beliin buat suami ultah, dia seneng banget. Bungkusnya rapi, aman. Makasih ya kak!', rating: 5 },
  { name: 'Agus Setiawan', role: 'Futsal Player', content: 'Udah order ke-3 kalinya, gapernah kecewa. Sablonan awet ga gampang pecah walau udah dicuci berkali-kali.', rating: 5 },
  { name: 'Putri Indah', role: 'Fans Chelsea', content: 'Jersey ceweknya pas di badan, ga kegedean. Jahitan rapih, worth it banget buat harga segini.', rating: 4 },
  { name: 'Fajar Nugraha', role: 'Mahasiswa', content: 'Mantap gan barang mendarat dengan selamat. Bonus stickernya keren. Besok order lagi yang away.', rating: 5 },
  { name: 'Rina Yuliana', role: '-', content: 'Respon penjual cepet banget. Pesen pagi, sore udah dikirim. Top markotop!', rating: 5 },
  { name: 'Eko Prasetyo', role: 'Wiraswasta', content: 'Kualitas kainnya oke punya, nyerep keringet. Buat main siang-siang ga bikin gerah.', rating: 5 },
  { name: 'Lestari Handayani', role: '-', content: 'Barang sesuai foto, ga tipu-tipu. Suka deh belanja disini, amanah.', rating: 5 },
  { name: 'Dimas Anggara', role: 'Fans Arsenal', content: 'COYG! Jersey Arsenal musim ini keren parah. Detail kerahnya mantep. Packing aman bubble wrap tebel.', rating: 5 },
  { name: 'Nina Wulandari', role: '-', content: 'Lucu banget packagingnya. Barangnya juga bagus, ga ada cacat sedikitpun. Recommended seller!', rating: 5 },
  { name: 'Tono Sudirjo', role: 'Bapak-bapak Komplek', content: 'Lumayan buat lari pagi. Bahannya enteng. Harga bersahabat di kantong pensiunan hehe.', rating: 4 },
  { name: 'Mega Puspita', role: 'Reseller', content: 'Buat yang mau dropship disini aman banget. Admin kooperatif, kirim atas nama kita. Laris manis!', rating: 5 },
  { name: 'Bayu Saputra', role: 'Gamers', content: 'Nitip temen beli disini, ternyata emang bagus. Next bakal beli sendiri sih. Sukses terus min.', rating: 5 },
  { name: 'Intan Permata', role: '-', content: 'Warnanya solid ga luntur. Udah coba cuci mesin aman jaya. Mantap jiwa!', rating: 5 },
  { name: 'Hendra Gunawan', role: 'Karyawan Swasta', content: 'Pengiriman kilat. Kualitas interlokal harga lokal. Juara!', rating: 5 },
  { name: 'Ratna Sari', role: '-', content: 'Size M nya pas banget. Suka cuttingannya sporty tapi tetep sopan. Thank you!', rating: 5 },
  { name: 'Arif Hidayat', role: 'Mahasiswa', content: 'Gokil, dikasih bonus gantungan kunci juga. Detail kecil yang bikin seneng customer nih.', rating: 5 },
  { name: 'Bambang Pamungkas', role: 'Bukan Pemain Bola', content: 'Awalnya ragu, eh pas dateng ternyata bagus banget. Nyesel cuma beli satu. Besok borong buat tim kantor.', rating: 5 },
  { name: 'Doni Tata', role: 'Anak Motor', content: 'Beli windbreaker-nya juga, anget dipake motoran malem-malem. Jersey oke, jaket oke.', rating: 5 },
  { name: 'Tina Toon', role: 'Diet Fighter', content: 'Bagus, sesuai ekspektasi. Pengiriman agak lama dikit sih di ekspedisi, tapi barang oke.', rating: 4 },
  { name: 'Yudi Lesmana', role: 'Guru Olahraga', content: 'Saya pesen buat seragam tim sekolah, dikasih diskon lumayan. Kualitas standar distro.', rating: 5 },
  { name: 'Maya Putri', role: '-', content: 'Bahan adem, ga nerawang. Cocok buat dipake jalan-jalan juga ternyata, trendy.', rating: 5 },
  { name: 'Kevin Ardian', role: 'Badminton Lover', content: 'Meskipun jersey bola, tapi enak juga dipake buat nepok bulu. Ringan bahannya.', rating: 5 },
  { name: 'Lia Marlina', role: '-', content: 'Suka motifnya, detail banget. Printingnya tajem ga burem. Best deal!', rating: 5 },
  { name: 'Rahmat Hidayat', role: '-', content: 'Sultan mah bebas, tapi ini emang kualitas sultan harga rakyat jelata. Keren abis!', rating: 5 },
  { name: 'Nurul Huda', role: '-', content: 'Gemes banget jersey kids-nya. Bahannya lembut ga bikin iritasi kulit anak. Makasih min.', rating: 5 },
  { name: 'Dedi Mulyadi', role: 'Pegawai', content: 'Gw akuin ini bagus. Smart people belinya disini. Five stars.', rating: 5 },
  { name: 'Andi Wijaya', role: 'Wiraswasta', content: 'Makan sate di pinggir jalan, jerseynya oke punya kawan! Cakep bener dah.', rating: 5 }
];

async function main() {
  console.log('Seeding 30 Indonesian Testimonials...');
  
  try {
    // Clear existing testimonials 
    await db.delete(testimonials); 
    
    // Loop removed as per user request (No Dummy Data)
    /*
    let i = 0;
    for (const t of indoTestimonials) {
      ...
    }
    */

    console.log('✅ Successfully cleared testimonials (No data added).');
    
  } catch (error) {
    console.error('❌ Failed to clear testimonials:', error);
  }
  process.exit(0);
}

main();
