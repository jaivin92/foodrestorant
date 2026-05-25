package com.foodrestorant.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.foodrestorant.ui.components.AppCard
import com.foodrestorant.ui.components.AppTextField
import com.foodrestorant.ui.components.PrimaryButton
import com.foodrestorant.ui.components.RestaurantBottomNav
import com.foodrestorant.ui.components.StatusChip
import com.foodrestorant.ui.theme.AppColors
import com.foodrestorant.ui.theme.AppSpacing

@Composable
fun RestaurantAppUI() {
    var selectedTab by remember { mutableStateOf(0) }
    Scaffold(bottomBar = { RestaurantBottomNav(selectedTab) { selectedTab = it } }) { padding ->
        Column(
            Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(AppSpacing.ScreenPadding),
            verticalArrangement = Arrangement.spacedBy(AppSpacing.Medium)
        ) {
            Text("Restaurant POS", style = MaterialTheme.typography.headlineLarge)
            when (selectedTab) {
                0 -> DashboardScreen()
                1 -> TableSelectionScreen()
                2 -> OrderTakingScreen()
                3 -> KitchenQueueScreen()
                4 -> BillPaymentScreen()
            }
        }
    }
}

@Composable fun LoginScreen() { AppCard("Login", "Fast sign-in with large touch targets") }
@Composable fun DashboardScreen() { AppCard("Dashboard", "Today's sales, active tables, and kitchen load") }
@Composable fun TableSelectionScreen() { AppCard("Table Selection", "Grid/list of tables with occupancy status") }

@Composable
fun OrderTakingScreen() {
    var notes by remember { mutableStateOf("") }
    AppCard("Order Taking", "Quick add items and special instructions")
    AppTextField(notes, { notes = it }, "Order notes")
    PrimaryButton("Send to Kitchen", onClick = {})
}

@Composable
fun KitchenQueueScreen() {
    val orders = listOf("#102 Burger + Fries", "#103 Pasta", "#104 Pizza")
    LazyColumn(verticalArrangement = Arrangement.spacedBy(AppSpacing.Small)) {
        items(orders) { order ->
            AppCard(title = order, subtitle = "Auto-refresh enabled")
        }
    }
}

@Composable
fun BillPaymentScreen() {
    Column(verticalArrangement = Arrangement.spacedBy(AppSpacing.Small)) {
        AppCard("Bill Payment", "Split, discount, and quick checkout")
        StatusChip("Ready to pay", AppColors.Success)
    }
}

@Composable fun OrderHistoryScreen() { AppCard("Order History", "Past orders with filters and receipts") }
