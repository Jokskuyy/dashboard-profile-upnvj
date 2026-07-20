-- =============================================================================
-- SEED KONFIGURASI DENAH 2D KAMPUS PONDOK LABU
-- Generated dari ekspor editor denah.
--
-- Prasyarat: jalankan database/003_campus_map_2d.sql terlebih dahulu.
-- Idempotent: konfigurasi untuk slug ini diganti di dalam satu transaksi.
-- Jika validasi gagal, seluruh perubahan otomatis di-rollback.
-- =============================================================================

BEGIN;

CREATE TEMP TABLE _campus_map_seed_payload (
    config JSONB NOT NULL
) ON COMMIT DROP;

INSERT INTO _campus_map_seed_payload (config)
VALUES ($campus_config$
{
  "map": {
    "nama": "Kampus Pondok Labu",
    "slug": "pondok-labu-2d",
    "image_url": "/maps/denah-2d-grass-bright.png",
    "image_width": 1662,
    "image_height": 946
  },
  "edges": [
    {
      "to": "node_34",
      "from": "node_32",
      "weight": null,
      "accessible": true,
      "bidirectional": true
    },
    {
      "to": "node_47",
      "from": "node_31",
      "weight": null,
      "accessible": true,
      "bidirectional": true
    },
    {
      "to": "node_48",
      "from": "node_47",
      "weight": null,
      "accessible": true,
      "bidirectional": true
    },
    {
      "to": "node_43",
      "from": "node_48",
      "weight": null,
      "accessible": true,
      "bidirectional": true
    },
    {
      "to": "node_37",
      "from": "node_35",
      "weight": null,
      "accessible": true,
      "bidirectional": true
    },
    {
      "to": "node_37",
      "from": "node_38",
      "weight": null,
      "accessible": true,
      "bidirectional": true
    },
    {
      "to": "node_40",
      "from": "node_38",
      "weight": null,
      "accessible": true,
      "bidirectional": true
    },
    {
      "to": "node_49",
      "from": "node_38",
      "weight": null,
      "accessible": true,
      "bidirectional": true
    },
    {
      "to": "node_40",
      "from": "node_49",
      "weight": null,
      "accessible": true,
      "bidirectional": true
    },
    {
      "to": "node_41",
      "from": "node_49",
      "weight": null,
      "accessible": true,
      "bidirectional": true
    },
    {
      "to": "node_3",
      "from": "node_41",
      "weight": null,
      "accessible": true,
      "bidirectional": true
    },
    {
      "to": "node_40",
      "from": "node_3",
      "weight": null,
      "accessible": true,
      "bidirectional": true
    },
    {
      "to": "node_39",
      "from": "node_40",
      "weight": null,
      "accessible": true,
      "bidirectional": true
    },
    {
      "to": "node_44",
      "from": "node_39",
      "weight": null,
      "accessible": true,
      "bidirectional": true
    },
    {
      "to": "node_8",
      "from": "node_44",
      "weight": null,
      "accessible": true,
      "bidirectional": true
    },
    {
      "to": "node_8",
      "from": "node_10",
      "weight": null,
      "accessible": true,
      "bidirectional": true
    },
    {
      "to": "node_9",
      "from": "node_8",
      "weight": null,
      "accessible": true,
      "bidirectional": true
    },
    {
      "to": "node_50",
      "from": "node_44",
      "weight": null,
      "accessible": true,
      "bidirectional": true
    },
    {
      "to": "node_50",
      "from": "node_9",
      "weight": null,
      "accessible": true,
      "bidirectional": true
    },
    {
      "to": "node_51",
      "from": "node_50",
      "weight": null,
      "accessible": true,
      "bidirectional": true
    },
    {
      "to": "node_28",
      "from": "node_51",
      "weight": null,
      "accessible": true,
      "bidirectional": true
    },
    {
      "to": "node_1",
      "from": "node_50",
      "weight": null,
      "accessible": true,
      "bidirectional": true
    },
    {
      "to": "node_23",
      "from": "node_44",
      "weight": null,
      "accessible": true,
      "bidirectional": true
    },
    {
      "to": "node_55",
      "from": "node_35",
      "weight": null,
      "accessible": true,
      "bidirectional": true
    },
    {
      "to": "node_29",
      "from": "node_34",
      "weight": null,
      "accessible": true,
      "bidirectional": true
    },
    {
      "to": "node_5",
      "from": "node_55",
      "weight": null,
      "accessible": true,
      "bidirectional": true
    },
    {
      "to": "node_26",
      "from": "node_41",
      "weight": null,
      "accessible": true,
      "bidirectional": true
    },
    {
      "to": "node_21",
      "from": "node_41",
      "weight": null,
      "accessible": true,
      "bidirectional": true
    },
    {
      "to": "node_21",
      "from": "node_49",
      "weight": null,
      "accessible": true,
      "bidirectional": true
    },
    {
      "to": "node_26",
      "from": "node_49",
      "weight": null,
      "accessible": true,
      "bidirectional": true
    },
    {
      "to": "node_20",
      "from": "node_49",
      "weight": null,
      "accessible": true,
      "bidirectional": true
    },
    {
      "to": "node_15",
      "from": "node_38",
      "weight": null,
      "accessible": true,
      "bidirectional": true
    },
    {
      "to": "node_6",
      "from": "node_38",
      "weight": null,
      "accessible": true,
      "bidirectional": true
    },
    {
      "to": "node_27",
      "from": "node_49",
      "weight": null,
      "accessible": true,
      "bidirectional": true
    },
    {
      "to": "node_12",
      "from": "node_48",
      "weight": null,
      "accessible": true,
      "bidirectional": true
    },
    {
      "to": "node_14",
      "from": "node_48",
      "weight": null,
      "accessible": true,
      "bidirectional": true
    },
    {
      "to": "node_42",
      "from": "node_43",
      "weight": null,
      "accessible": true,
      "bidirectional": true
    },
    {
      "to": "node_13",
      "from": "node_42",
      "weight": null,
      "accessible": true,
      "bidirectional": true
    },
    {
      "to": "node_6",
      "from": "node_13",
      "weight": null,
      "accessible": true,
      "bidirectional": true
    },
    {
      "to": "node_20",
      "from": "node_40",
      "weight": null,
      "accessible": true,
      "bidirectional": true
    },
    {
      "to": "node_20",
      "from": "node_38",
      "weight": null,
      "accessible": true,
      "bidirectional": true
    },
    {
      "to": "node_53",
      "from": "node_54",
      "weight": null,
      "accessible": true,
      "bidirectional": true
    },
    {
      "to": "node_4",
      "from": "node_54",
      "weight": null,
      "accessible": true,
      "bidirectional": true
    },
    {
      "to": "node_58",
      "from": "node_54",
      "weight": null,
      "accessible": true,
      "bidirectional": true
    },
    {
      "to": "node_1",
      "from": "node_58",
      "weight": null,
      "accessible": true,
      "bidirectional": true
    },
    {
      "to": "node_42",
      "from": "node_2",
      "weight": null,
      "accessible": true,
      "bidirectional": true
    },
    {
      "to": "node_46",
      "from": "node_2",
      "weight": null,
      "accessible": true,
      "bidirectional": true
    },
    {
      "to": "node_27",
      "from": "node_2",
      "weight": null,
      "accessible": true,
      "bidirectional": true
    },
    {
      "to": "node_27",
      "from": "node_46",
      "weight": null,
      "accessible": true,
      "bidirectional": true
    },
    {
      "to": "node_27",
      "from": "node_42",
      "weight": null,
      "accessible": true,
      "bidirectional": true
    },
    {
      "to": "node_46",
      "from": "node_45",
      "weight": null,
      "accessible": true,
      "bidirectional": true
    },
    {
      "to": "node_53",
      "from": "node_45",
      "weight": null,
      "accessible": true,
      "bidirectional": true
    },
    {
      "to": "node_22",
      "from": "node_45",
      "weight": null,
      "accessible": true,
      "bidirectional": true
    },
    {
      "to": "node_52",
      "from": "node_45",
      "weight": null,
      "accessible": true,
      "bidirectional": true
    },
    {
      "to": "node_52",
      "from": "node_39",
      "weight": null,
      "accessible": true,
      "bidirectional": true
    },
    {
      "to": "node_22",
      "from": "node_39",
      "weight": null,
      "accessible": true,
      "bidirectional": true
    },
    {
      "to": "node_23",
      "from": "node_50",
      "weight": null,
      "accessible": true,
      "bidirectional": true
    },
    {
      "to": "node_57",
      "from": "node_29",
      "weight": null,
      "accessible": true,
      "bidirectional": true
    },
    {
      "to": "node_24",
      "from": "node_57",
      "weight": null,
      "accessible": true,
      "bidirectional": true
    },
    {
      "to": "node_25",
      "from": "node_3",
      "weight": null,
      "accessible": true,
      "bidirectional": true
    },
    {
      "to": "node_25",
      "from": "node_40",
      "weight": null,
      "accessible": true,
      "bidirectional": true
    },
    {
      "to": "node_25",
      "from": "node_59",
      "weight": null,
      "accessible": true,
      "bidirectional": true
    },
    {
      "to": "node_3",
      "from": "node_59",
      "weight": null,
      "accessible": true,
      "bidirectional": true
    },
    {
      "to": "node_60",
      "from": "node_59",
      "weight": null,
      "accessible": true,
      "bidirectional": true
    },
    {
      "to": "node_61",
      "from": "node_60",
      "weight": null,
      "accessible": true,
      "bidirectional": true
    },
    {
      "to": "node_10",
      "from": "node_61",
      "weight": null,
      "accessible": true,
      "bidirectional": true
    },
    {
      "to": "node_8",
      "from": "node_61",
      "weight": null,
      "accessible": true,
      "bidirectional": true
    },
    {
      "to": "node_11",
      "from": "node_13",
      "weight": null,
      "accessible": true,
      "bidirectional": true
    },
    {
      "to": "node_36",
      "from": "node_11",
      "weight": null,
      "accessible": true,
      "bidirectional": true
    },
    {
      "to": "node_55",
      "from": "node_36",
      "weight": null,
      "accessible": true,
      "bidirectional": true
    },
    {
      "to": "node_7",
      "from": "node_11",
      "weight": null,
      "accessible": true,
      "bidirectional": true
    },
    {
      "to": "node_7",
      "from": "node_55",
      "weight": null,
      "accessible": true,
      "bidirectional": true
    },
    {
      "to": "node_7",
      "from": "node_37",
      "weight": null,
      "accessible": true,
      "bidirectional": true
    },
    {
      "to": "node_16",
      "from": "node_35",
      "weight": null,
      "accessible": true,
      "bidirectional": true
    },
    {
      "to": "node_16",
      "from": "node_56",
      "weight": null,
      "accessible": true,
      "bidirectional": true
    },
    {
      "to": "node_16",
      "from": "node_37",
      "weight": null,
      "accessible": true,
      "bidirectional": true
    },
    {
      "to": "node_56",
      "from": "node_35",
      "weight": null,
      "accessible": true,
      "bidirectional": true
    },
    {
      "to": "node_17",
      "from": "node_56",
      "weight": null,
      "accessible": true,
      "bidirectional": true
    },
    {
      "to": "node_17",
      "from": "node_34",
      "weight": null,
      "accessible": true,
      "bidirectional": true
    },
    {
      "to": "node_17",
      "from": "node_35",
      "weight": null,
      "accessible": true,
      "bidirectional": true
    },
    {
      "to": "node_56",
      "from": "node_34",
      "weight": null,
      "accessible": true,
      "bidirectional": true
    },
    {
      "to": "node_62",
      "from": "node_32",
      "weight": null,
      "accessible": true,
      "bidirectional": true
    },
    {
      "to": "node_63",
      "from": "node_62",
      "weight": null,
      "accessible": true,
      "bidirectional": true
    },
    {
      "to": "node_31",
      "from": "node_63",
      "weight": null,
      "accessible": true,
      "bidirectional": true
    },
    {
      "to": "node_19",
      "from": "node_31",
      "weight": null,
      "accessible": true,
      "bidirectional": true
    },
    {
      "to": "node_32",
      "from": "node_18",
      "weight": null,
      "accessible": true,
      "bidirectional": true
    },
    {
      "to": "node_62",
      "from": "node_18",
      "weight": null,
      "accessible": true,
      "bidirectional": true
    },
    {
      "to": "node_63",
      "from": "node_18",
      "weight": null,
      "accessible": true,
      "bidirectional": true
    },
    {
      "to": "node_63",
      "from": "node_19",
      "weight": null,
      "accessible": true,
      "bidirectional": true
    },
    {
      "to": "node_19",
      "from": "node_62",
      "weight": null,
      "accessible": true,
      "bidirectional": true
    },
    {
      "to": "node_19",
      "from": "node_32",
      "weight": null,
      "accessible": true,
      "bidirectional": true
    },
    {
      "to": "node_31",
      "from": "node_18",
      "weight": null,
      "accessible": true,
      "bidirectional": true
    },
    {
      "to": "node_65",
      "from": "node_24",
      "weight": null,
      "accessible": true,
      "bidirectional": true
    },
    {
      "to": "node_64",
      "from": "node_65",
      "weight": null,
      "accessible": true,
      "bidirectional": true
    },
    {
      "to": "node_38",
      "from": "node_64",
      "weight": null,
      "accessible": true,
      "bidirectional": true
    },
    {
      "to": "node_64",
      "from": "node_15",
      "weight": null,
      "accessible": true,
      "bidirectional": true
    }
  ],
  "nodes": [
    {
      "x": 0.197797891564828,
      "y": 0.576179794251326,
      "key": "node_1",
      "type": "building_entrance",
      "label": "Pintu Parkir Hukum"
    },
    {
      "x": 0.457932063893334,
      "y": 0.823544941521529,
      "key": "node_2",
      "type": "building_entrance",
      "label": "Pintu Gedung Abdul Rahman Saleh"
    },
    {
      "x": 0.419298275923754,
      "y": 0.254906767613807,
      "key": "node_3",
      "type": "building_entrance",
      "label": "Pintu Gedung Dewi Sartika"
    },
    {
      "x": 0.187495548106273,
      "y": 0.769245275047582,
      "key": "node_4",
      "type": "building_entrance",
      "label": "Pintu Gedung Dr. Cipto Mangunkusumo"
    },
    {
      "x": 0.769577953514615,
      "y": 0.668187562443292,
      "key": "node_5",
      "type": "building_entrance",
      "label": "Pintu Gedung DR. Soepomo"
    },
    {
      "x": 0.548936097777234,
      "y": 0.660645942099688,
      "key": "node_6",
      "type": "building_entrance",
      "label": "Pintu Gedung Dr. Wahidin Sudiro Husodo"
    },
    {
      "x": 0.697461549304732,
      "y": 0.657629293962247,
      "key": "node_7",
      "type": "building_entrance",
      "label": "Pintu Gedung Dr. Wahidin Sudiro Husodo"
    },
    {
      "x": 0.337738056876862,
      "y": 0.469088785372153,
      "key": "node_8",
      "type": "building_entrance",
      "label": "Pintu Gedung Ki Hadjar Dewantara"
    },
    {
      "x": 0.24501696574987,
      "y": 0.469088785372153,
      "key": "node_9",
      "type": "building_entrance",
      "label": "Pintu Gedung Ki Hadjar Dewantara"
    },
    {
      "x": 0.342030699984594,
      "y": 0.375572693111467,
      "key": "node_10",
      "type": "building_entrance",
      "label": "Pintu Gedung Ki Hadjar Dewantara"
    },
    {
      "x": 0.699178606547824,
      "y": 0.769245275047582,
      "key": "node_11",
      "type": "building_entrance",
      "label": "Pintu Gedung Muh. Husni Thamrin"
    },
    {
      "x": 0.640798660282681,
      "y": 0.859744719170827,
      "key": "node_12",
      "type": "building_entrance",
      "label": "Pintu Gedung Muh. Husni Thamrin"
    },
    {
      "x": 0.561814027100428,
      "y": 0.769245275047582,
      "key": "node_13",
      "type": "building_entrance",
      "label": "Pintu Gedung Muh. Husni Thamrin"
    },
    {
      "x": 0.639081603039588,
      "y": 0.908011089369891,
      "key": "node_14",
      "type": "building_entrance",
      "label": "Pintu Gedung Muhammad Yamin"
    },
    {
      "x": 0.572974899180529,
      "y": 0.478138729784478,
      "key": "node_15",
      "type": "building_entrance",
      "label": "Pintu Gedung RA Kartini"
    },
    {
      "x": 0.748114737975959,
      "y": 0.478138729784478,
      "key": "node_16",
      "type": "building_entrance",
      "label": "Pintu Gedung RA Kartini"
    },
    {
      "x": 0.809928798727287,
      "y": 0.533946720327145,
      "key": "node_17",
      "type": "building_entrance",
      "label": "Pintu Gedung Rektorat (jenderal soedirman)"
    },
    {
      "x": 0.917244876420566,
      "y": 0.577688118320047,
      "key": "node_18",
      "type": "building_entrance",
      "label": "Pintu Gedung Rektorat (jenderal soedirman)"
    },
    {
      "x": 0.918103405042112,
      "y": 0.687795775336662,
      "key": "node_19",
      "type": "building_entrance",
      "label": "Pintu Gedung Rektorat (jenderal soedirman)"
    },
    {
      "x": 0.507726723943016,
      "y": 0.479647053853198,
      "key": "node_20",
      "type": "building_entrance",
      "label": "Pintu Gedung Soetomo"
    },
    {
      "x": 0.491414680133637,
      "y": 0.360489452424259,
      "key": "node_21",
      "type": "building_entrance",
      "label": "Pintu Gedung Soetomo"
    },
    {
      "x": 0.372937730360258,
      "y": 0.627462812587832,
      "key": "node_22",
      "type": "building_entrance",
      "label": "Pintu Gedung Yos Sudarso"
    },
    {
      "x": 0.310265140987383,
      "y": 0.556571581357957,
      "key": "node_23",
      "type": "building_entrance",
      "label": "Pintu Gedung Yos Sudarso"
    },
    {
      "x": 0.575550485045167,
      "y": 0.336356267324727,
      "key": "node_24",
      "type": "building_entrance",
      "label": "Pintu Kantin"
    },
    {
      "x": 0.427883562139216,
      "y": 0.328814646981124,
      "key": "node_25",
      "type": "building_entrance",
      "label": "Pintu Lapangan Basket"
    },
    {
      "x": 0.485404979782814,
      "y": 0.34238956359961,
      "key": "node_26",
      "type": "building_entrance",
      "label": "Pintu Lapangan Basket"
    },
    {
      "x": 0.469951464594982,
      "y": 0.636512757000156,
      "key": "node_27",
      "type": "building_entrance",
      "label": "Pintu Lapangan Upacara"
    },
    {
      "x": 0.16088116083834,
      "y": 0.461547165028549,
      "key": "node_28",
      "type": "building_entrance",
      "label": "Pintu Parkir Belakang UPNVJ"
    },
    {
      "x": 0.806494684241102,
      "y": 0.218706989964509,
      "key": "node_29",
      "type": "building_entrance",
      "label": "Pintu Parkir Depan UPNVJ"
    },
    {
      "x": 0.956737193011692,
      "y": 0.867286339514431,
      "key": "node_31",
      "type": "path",
      "label": null
    },
    {
      "x": 0.9550201357686,
      "y": 0.446463924341342,
      "key": "node_32",
      "type": "path",
      "label": null
    },
    {
      "x": 0.816797027699657,
      "y": 0.440430628066459,
      "key": "node_34",
      "type": "path",
      "label": null
    },
    {
      "x": 0.754124438326783,
      "y": 0.511321859296334,
      "key": "node_35",
      "type": "path",
      "label": null
    },
    {
      "x": 0.753265909705236,
      "y": 0.742095441810609,
      "key": "node_36",
      "type": "path",
      "label": null
    },
    {
      "x": 0.709480950006379,
      "y": 0.512830183365055,
      "key": "node_37",
      "type": "path",
      "label": null
    },
    {
      "x": 0.551511683641873,
      "y": 0.527913424052262,
      "key": "node_38",
      "type": "path",
      "label": null
    },
    {
      "x": 0.403844760735922,
      "y": 0.511321859296334,
      "key": "node_39",
      "type": "path",
      "label": null
    },
    {
      "x": 0.426166504896124,
      "y": 0.500763590815289,
      "key": "node_40",
      "type": "path",
      "label": null
    },
    {
      "x": 0.487980565647452,
      "y": 0.26244838795741,
      "key": "node_41",
      "type": "path",
      "label": null
    },
    {
      "x": 0.547219040534142,
      "y": 0.791870136078394,
      "key": "node_42",
      "type": "path",
      "label": null
    },
    {
      "x": 0.550653155020327,
      "y": 0.88538622833908,
      "key": "node_43",
      "type": "path",
      "label": null
    },
    {
      "x": 0.339455114119955,
      "y": 0.515846831502496,
      "key": "node_44",
      "type": "path",
      "label": null
    },
    {
      "x": 0.401269174871283,
      "y": 0.739078793673167,
      "key": "node_45",
      "type": "path",
      "label": null
    },
    {
      "x": 0.414147104194477,
      "y": 0.791870136078394,
      "key": "node_46",
      "type": "path",
      "label": null
    },
    {
      "x": 0.800484983890279,
      "y": 0.883877904270359,
      "key": "node_47",
      "type": "path",
      "label": null
    },
    {
      "x": 0.637364545796496,
      "y": 0.88538622833908,
      "key": "node_48",
      "type": "path",
      "label": null
    },
    {
      "x": 0.489697622890545,
      "y": 0.515846831502496,
      "key": "node_49",
      "type": "path",
      "label": null
    },
    {
      "x": 0.197797891564828,
      "y": 0.521880127777379,
      "key": "node_50",
      "type": "path",
      "label": null
    },
    {
      "x": 0.161739689459886,
      "y": 0.5233884518461,
      "key": "node_51",
      "type": "path",
      "label": null
    },
    {
      "x": 0.404703289357468,
      "y": 0.607854599694462,
      "key": "node_52",
      "type": "path",
      "label": null
    },
    {
      "x": 0.269055767153164,
      "y": 0.739078793673167,
      "key": "node_53",
      "type": "path",
      "label": null
    },
    {
      "x": 0.188354076727819,
      "y": 0.739078793673167,
      "key": "node_54",
      "type": "path",
      "label": null
    },
    {
      "x": 0.751548852462144,
      "y": 0.666679238374571,
      "key": "node_55",
      "type": "path",
      "label": null
    },
    {
      "x": 0.785889997323993,
      "y": 0.479647053853198,
      "key": "node_56",
      "type": "path",
      "label": null
    },
    {
      "x": 0.736953865895858,
      "y": 0.208148721483463,
      "key": "node_57",
      "type": "path",
      "label": null
    },
    {
      "x": 0.19951494880792,
      "y": 0.708912312298752,
      "key": "node_58",
      "type": "path",
      "label": null
    },
    {
      "x": 0.417581218680662,
      "y": 0.316748054431357,
      "key": "node_59",
      "type": "path",
      "label": null
    },
    {
      "x": 0.359201272415518,
      "y": 0.32278135070624,
      "key": "node_60",
      "type": "path",
      "label": null
    },
    {
      "x": 0.358342743793972,
      "y": 0.372556044974025,
      "key": "node_61",
      "type": "path",
      "label": null
    },
    {
      "x": 0.953303078525507,
      "y": 0.576179794251326,
      "key": "node_62",
      "type": "path",
      "label": null
    },
    {
      "x": 0.953303078525507,
      "y": 0.687795775336662,
      "key": "node_63",
      "type": "path",
      "label": null
    },
    {
      "x": 0.550653155020327,
      "y": 0.46305548909727,
      "key": "node_64",
      "type": "path",
      "label": null
    },
    {
      "x": 0.551511683641873,
      "y": 0.339372915462169,
      "key": "node_65",
      "type": "path",
      "label": null
    }
  ],
  "buildings": [
    {
      "entrance": "node_2",
      "marker_x": 0.455356478028696,
      "marker_y": 0.888402876476522,
      "gedung_id": 5,
      "nama_gedung": "Gedung Abdul Rahman Saleh"
    },
    {
      "entrance": "node_3",
      "marker_x": 0.431317676625401,
      "marker_y": 0.187032184521373,
      "gedung_id": 13,
      "nama_gedung": "Gedung Dewi Sartika"
    },
    {
      "entrance": "node_4",
      "marker_x": 0.187495548106273,
      "marker_y": 0.831086561865133,
      "gedung_id": 4,
      "nama_gedung": "Gedung Dr. Cipto Mangunkusumo"
    },
    {
      "entrance": "node_5",
      "marker_x": 0.788465583188632,
      "marker_y": 0.662154266168409,
      "gedung_id": 2,
      "nama_gedung": "Gedung DR. Soepomo"
    },
    {
      "entrance": "node_7",
      "marker_x": 0.628779259581033,
      "marker_y": 0.659137618030968,
      "gedung_id": 3,
      "nama_gedung": "Gedung Dr. Wahidin Sudiro Husodo"
    },
    {
      "entrance": "node_10",
      "marker_x": 0.264763124045433,
      "marker_y": 0.375572693111467,
      "gedung_id": 6,
      "nama_gedung": "Gedung Ki Hadjar Dewantara"
    },
    {
      "entrance": "node_13",
      "marker_x": 0.66827157617216,
      "marker_y": 0.820528293384088,
      "gedung_id": 7,
      "nama_gedung": "Gedung Muh. Husni Thamrin"
    },
    {
      "entrance": "node_14",
      "marker_x": 0.644232774768865,
      "marker_y": 0.938177570744306,
      "gedung_id": 8,
      "nama_gedung": "Gedung Muhammad Yamin"
    },
    {
      "entrance": "node_16",
      "marker_x": 0.669988633415252,
      "marker_y": 0.435905655860297,
      "gedung_id": 10,
      "nama_gedung": "Gedung RA Kartini"
    },
    {
      "entrance": "node_19",
      "marker_x": 0.870884330857069,
      "marker_y": 0.668187562443292,
      "gedung_id": 1,
      "nama_gedung": "Gedung Rektorat (jenderal soedirman)"
    },
    {
      "entrance": "node_21",
      "marker_x": 0.51802906740157,
      "marker_y": 0.358981128355538,
      "gedung_id": 16,
      "nama_gedung": "Gedung Soetomo"
    },
    {
      "entrance": "node_23",
      "marker_x": 0.315416312716661,
      "marker_y": 0.62444616445039,
      "gedung_id": 9,
      "nama_gedung": "Gedung Yos Sudarso"
    },
    {
      "entrance": "node_24",
      "marker_x": 0.564389612965067,
      "marker_y": 0.277531628644618,
      "gedung_id": 19,
      "nama_gedung": "Kantin"
    },
    {
      "entrance": "node_26",
      "marker_x": 0.455356478028696,
      "marker_y": 0.38311431345507,
      "gedung_id": 17,
      "nama_gedung": "Lapangan Basket"
    },
    {
      "entrance": "node_27",
      "marker_x": 0.471668521838074,
      "marker_y": 0.656120969893526,
      "gedung_id": 14,
      "nama_gedung": "Lapangan Upacara"
    },
    {
      "entrance": "node_28",
      "marker_x": 0.152295874622878,
      "marker_y": 0.395180906004837,
      "gedung_id": 12,
      "nama_gedung": "Parkir Belakang UPNVJ"
    },
    {
      "entrance": "node_29",
      "marker_x": 0.641657188904227,
      "marker_y": 0.253398443545086,
      "gedung_id": 11,
      "nama_gedung": "Parkir Depan UPNVJ"
    },
    {
      "entrance": "node_1",
      "marker_x": 0.184061433620088,
      "marker_y": 0.641037729206319,
      "gedung_id": 18,
      "nama_gedung": "Parkir Hukum"
    }
  ],
  "format_version": 1
}
$campus_config$::JSONB);

DO $$
DECLARE
    seed_version INT;
BEGIN
    SELECT (config ->> 'format_version')::INT
    INTO seed_version
    FROM _campus_map_seed_payload;

    IF seed_version IS DISTINCT FROM 1 THEN
        RAISE EXCEPTION 'Format konfigurasi denah tidak didukung: %', seed_version;
    END IF;
END
$$;

-- Pastikan hanya map pada seed ini yang aktif sebelum upsert.
UPDATE public.campus_maps
SET is_active = FALSE,
    updated_at = NOW()
WHERE is_active = TRUE
  AND slug <> (
      SELECT config -> 'map' ->> 'slug'
      FROM _campus_map_seed_payload
  );

INSERT INTO public.campus_maps (
    slug,
    nama,
    image_url,
    image_width,
    image_height,
    is_active
)
SELECT
    config -> 'map' ->> 'slug',
    config -> 'map' ->> 'nama',
    config -> 'map' ->> 'image_url',
    (config -> 'map' ->> 'image_width')::INT,
    (config -> 'map' ->> 'image_height')::INT,
    TRUE
FROM _campus_map_seed_payload
ON CONFLICT (slug) DO UPDATE SET
    nama = EXCLUDED.nama,
    image_url = EXCLUDED.image_url,
    image_width = EXCLUDED.image_width,
    image_height = EXCLUDED.image_height,
    is_active = TRUE,
    updated_at = NOW();

CREATE TEMP TABLE _campus_map_seed_context (
    map_id BIGINT PRIMARY KEY
) ON COMMIT DROP;

INSERT INTO _campus_map_seed_context (map_id)
SELECT m.id
FROM public.campus_maps m
JOIN _campus_map_seed_payload p
  ON m.slug = p.config -> 'map' ->> 'slug';

-- Hentikan proses apabila gedung pada seed tidak cocok dengan master gedung.
DO $$
DECLARE
    invalid_buildings TEXT;
BEGIN
    SELECT string_agg(
        format(
            '%s (id=%s)',
            building ->> 'nama_gedung',
            building ->> 'gedung_id'
        ),
        ', '
    )
    INTO invalid_buildings
    FROM _campus_map_seed_payload p
    CROSS JOIN LATERAL jsonb_array_elements(p.config -> 'buildings') building
    LEFT JOIN public.gedung g
      ON g.id = (building ->> 'gedung_id')::INT
     AND g.nama_gedung = building ->> 'nama_gedung'
    WHERE g.id IS NULL;

    IF invalid_buildings IS NOT NULL THEN
        RAISE EXCEPTION
            'Master gedung tidak cocok dengan seed denah: %',
            invalid_buildings;
    END IF;
END
$$;

-- Hapus konfigurasi lama untuk map ini. Urutan mengikuti foreign key.
DELETE FROM public.campus_map_building_points
WHERE map_id = (SELECT map_id FROM _campus_map_seed_context);

DELETE FROM public.campus_map_edges
WHERE map_id = (SELECT map_id FROM _campus_map_seed_context);

DELETE FROM public.campus_map_nodes
WHERE map_id = (SELECT map_id FROM _campus_map_seed_context);

CREATE TEMP TABLE _campus_map_seed_node_ids (
    source_key TEXT PRIMARY KEY,
    node_id BIGINT NOT NULL UNIQUE
) ON COMMIT DROP;

-- Insert node satu per satu agar source key hasil ekspor dapat dipetakan
-- ke ID baru yang dibuat database.
DO $$
DECLARE
    node_config JSONB;
    inserted_node_id BIGINT;
    target_map_id BIGINT;
BEGIN
    SELECT map_id
    INTO target_map_id
    FROM _campus_map_seed_context;

    FOR node_config IN
        SELECT node
        FROM _campus_map_seed_payload p
        CROSS JOIN LATERAL jsonb_array_elements(p.config -> 'nodes') node
    LOOP
        INSERT INTO public.campus_map_nodes (
            map_id,
            label,
            node_type,
            x,
            y
        )
        VALUES (
            target_map_id,
            NULLIF(node_config ->> 'label', ''),
            node_config ->> 'type',
            (node_config ->> 'x')::DOUBLE PRECISION,
            (node_config ->> 'y')::DOUBLE PRECISION
        )
        RETURNING id INTO inserted_node_id;

        INSERT INTO _campus_map_seed_node_ids (source_key, node_id)
        VALUES (node_config ->> 'key', inserted_node_id);
    END LOOP;
END
$$;

INSERT INTO public.campus_map_edges (
    map_id,
    from_node_id,
    to_node_id,
    bidirectional,
    accessible,
    weight
)
SELECT
    context.map_id,
    from_node.node_id,
    to_node.node_id,
    (edge ->> 'bidirectional')::BOOLEAN,
    (edge ->> 'accessible')::BOOLEAN,
    NULLIF(edge ->> 'weight', '')::DOUBLE PRECISION
FROM _campus_map_seed_payload payload
CROSS JOIN _campus_map_seed_context context
CROSS JOIN LATERAL jsonb_array_elements(payload.config -> 'edges') edge
JOIN _campus_map_seed_node_ids from_node
  ON from_node.source_key = edge ->> 'from'
JOIN _campus_map_seed_node_ids to_node
  ON to_node.source_key = edge ->> 'to';

INSERT INTO public.campus_map_building_points (
    map_id,
    gedung_id,
    marker_x,
    marker_y,
    entrance_node_id
)
SELECT
    context.map_id,
    (building ->> 'gedung_id')::INT,
    (building ->> 'marker_x')::DOUBLE PRECISION,
    (building ->> 'marker_y')::DOUBLE PRECISION,
    entrance.node_id
FROM _campus_map_seed_payload payload
CROSS JOIN _campus_map_seed_context context
CROSS JOIN LATERAL jsonb_array_elements(payload.config -> 'buildings') building
JOIN public.gedung g
  ON g.id = (building ->> 'gedung_id')::INT
LEFT JOIN _campus_map_seed_node_ids entrance
  ON entrance.source_key = building ->> 'entrance';

-- Pastikan tidak ada record yang hilang karena referensi node/gedung invalid.
DO $$
DECLARE
    target_map_id BIGINT;
    expected_nodes INT;
    expected_edges INT;
    expected_buildings INT;
    actual_nodes INT;
    actual_edges INT;
    actual_buildings INT;
BEGIN
    SELECT map_id INTO target_map_id
    FROM _campus_map_seed_context;

    SELECT
        jsonb_array_length(config -> 'nodes'),
        jsonb_array_length(config -> 'edges'),
        jsonb_array_length(config -> 'buildings')
    INTO
        expected_nodes,
        expected_edges,
        expected_buildings
    FROM _campus_map_seed_payload;

    SELECT COUNT(*) INTO actual_nodes
    FROM public.campus_map_nodes
    WHERE map_id = target_map_id;

    SELECT COUNT(*) INTO actual_edges
    FROM public.campus_map_edges
    WHERE map_id = target_map_id;

    SELECT COUNT(*) INTO actual_buildings
    FROM public.campus_map_building_points
    WHERE map_id = target_map_id;

    IF actual_nodes <> expected_nodes
       OR actual_edges <> expected_edges
       OR actual_buildings <> expected_buildings THEN
        RAISE EXCEPTION
            'Seed denah tidak lengkap. nodes %/%, edges %/%, buildings %/%',
            actual_nodes,
            expected_nodes,
            actual_edges,
            expected_edges,
            actual_buildings,
            expected_buildings;
    END IF;
END
$$;

COMMIT;

-- Ringkasan hasil seed.
SELECT
    m.slug,
    COUNT(DISTINCT n.id) AS node_count,
    COUNT(DISTINCT e.id) AS edge_count,
    COUNT(DISTINCT bp.id) AS building_count
FROM public.campus_maps m
LEFT JOIN public.campus_map_nodes n ON n.map_id = m.id
LEFT JOIN public.campus_map_edges e ON e.map_id = m.id
LEFT JOIN public.campus_map_building_points bp ON bp.map_id = m.id
WHERE m.slug = 'pondok-labu-2d'
GROUP BY m.slug;
