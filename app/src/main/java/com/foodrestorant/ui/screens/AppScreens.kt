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
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.foodrestorant.ui.components.AppCard
import com.foodrestorant.ui.components.AppTextField
import com.foodrestorant.ui.components.CategoryChip
import com.foodrestorant.ui.components.CategorySelector
import com.foodrestorant.ui.components.PrimaryButton
import com.foodrestorant.ui.components.RestaurantBottomNav
import com.foodrestorant.ui.components.SecondaryButton
import com.foodrestorant.ui.components.ShimmerPlaceholder
import com.foodrestorant.ui.components.StatusChip
import com.foodrestorant.ui.theme.AppColors
import com.foodrestorant.ui.theme.AppSpacing

enum class SessionScreen { Splash, Intro, Login, Dashboard }
enum class StaffRole { WAITER, COOK }

data class UserSession(val role: StaffRole, val userName: String)

@Composable
fun RestaurantAppRoot() {
    var screen by remember { mutableStateOf(SessionScreen.Splash) }
    var session by remember { mutableStateOf<UserSession?>(null) }

    when (screen) {
        SessionScreen.Splash -> SplashScreen(onContinue = { screen = SessionScreen.Intro })
        SessionScreen.Intro -> IntroSliderScreen(onFinish = { screen = SessionScreen.Login })
        SessionScreen.Login -> LoginScreen(
            onLoginWaiter = {
                session = UserSession(StaffRole.WAITER, "Waiter")
                screen = SessionScreen.Dashboard
            },
            onLoginCook = {
                session = UserSession(StaffRole.COOK, "Cook")
                screen = SessionScreen.Dashboard
            }
        )
        SessionScreen.Dashboard -> RestaurantAppUI(session = session ?: UserSession(StaffRole.WAITER, "Waiter"))
    }
}

@Composable
fun SplashScreen(onContinue: () -> Unit) {
    Scaffold { padding ->
        Column(Modifier.fillMaxSize().padding(padding).padding(AppSpacing.ScreenPadding), verticalArrangement = Arrangement.spacedBy(AppSpacing.Medium)) {
            ShimmerPlaceholder()
            AppCard("FoodRestorant POS", "Dynamic splash with shimmer + quick startup")
            PrimaryButton("Continue", onClick = onContinue)
        }
    }
}

@Composable
fun IntroSliderScreen(onFinish: () -> Unit) {
    val slides = listOf("Table-wise ordering", "Cook queue updates", "Fast billing")
    var index by remember { mutableIntStateOf(0) }
    Scaffold { padding ->
        Column(Modifier.fillMaxSize().padding(padding).padding(AppSpacing.ScreenPadding), verticalArrangement = Arrangement.spacedBy(AppSpacing.Medium)) {
            Text("Intro", style = MaterialTheme.typography.headlineMedium)
            AppCard("${index + 1}/${slides.size}", slides[index])
            PrimaryButton(if (index == slides.lastIndex) "Start" else "Next") {
                if (index == slides.lastIndex) onFinish() else index++
            }
        }
    }
}

@Composable
fun LoginScreen(onLoginWaiter: () -> Unit, onLoginCook: () -> Unit) {
    var mobile by remember { mutableStateOf("") }
    var pin by remember { mutableStateOf("") }
    Column(verticalArrangement = Arrangement.spacedBy(AppSpacing.Medium)) {
        AppCard("Staff Login", "Only staff can sign in to take and cook orders")
        AppTextField(mobile, { mobile = it }, "Mobile Number")
        AppTextField(pin, { pin = it }, "PIN")
        PrimaryButton("Login as Waiter", onLoginWaiter)
        SecondaryButton("Login as Cook", onLoginCook)
    }
}

@Composable
fun RestaurantAppUI(session: UserSession) {
    var selectedTab by remember { mutableIntStateOf(if (session.role == StaffRole.COOK) 3 else 0) }
    Scaffold(bottomBar = { RestaurantBottomNav(selectedTab) { selectedTab = it } }) { padding ->
        Column(Modifier.fillMaxSize().padding(padding).padding(AppSpacing.ScreenPadding), verticalArrangement = Arrangement.spacedBy(AppSpacing.Medium)) {
            Text("Welcome ${session.userName}", style = MaterialTheme.typography.headlineLarge)
            when (selectedTab) {
                0 -> DashboardScreen()
                1 -> TableSelectionScreen(session)
                2 -> OrderTakingScreen(session)
                3 -> KitchenQueueScreen(session)
                4 -> BillPaymentScreen()
            }
        }
    }
}

@Composable
fun DashboardScreen() {
    val categories = listOf(CategoryChip(0, "All"), CategoryChip(1, "Pizza"), CategoryChip(2, "Drinks"), CategoryChip(3, "Dessert"))
    var selectedCategory by remember { mutableIntStateOf(0) }
    Column(verticalArrangement = Arrangement.spacedBy(AppSpacing.Small)) {
        AppCard("Dashboard", "Category, products and tables overview")
        CategorySelector(categories, selectedCategory) { selectedCategory = it }
        AppCard("Products", "Filter by category #$selectedCategory")
        AppCard("Tables", "Available: 8 | Occupied: 12")
    }
}

@Composable
fun TableSelectionScreen(session: UserSession) {
    AppCard("Table Selection", "${session.role} can select table and manage active order")
}

@Composable
fun OrderTakingScreen(session: UserSession) {
    var notes by remember { mutableStateOf("") }
    Column(verticalArrangement = Arrangement.spacedBy(AppSpacing.Small)) {
        AppCard("Table Order", "Create/update table-wise order (staff only)")
        AppTextField(notes, { notes = it }, "Order notes")
        PrimaryButton("Add / Update Order", onClick = {})
        if (session.role == StaffRole.WAITER) StatusChip("Waiter mode enabled", AppColors.Success)
    }
}

@Composable
fun KitchenQueueScreen(session: UserSession) {
    val orders = listOf("T1 • #102 Burger + Fries", "T4 • #103 Pasta", "T6 • #104 Pizza")
    Column(verticalArrangement = Arrangement.spacedBy(AppSpacing.Small)) {
        AppCard("Kitchen Queue", "Cook checks and updates order status")
        LazyColumn(verticalArrangement = Arrangement.spacedBy(AppSpacing.Small)) {
            items(orders) { order -> AppCard(title = order, subtitle = "Status: Preparing") }
        }
        if (session.role == StaffRole.COOK) StatusChip("Cook mode enabled", AppColors.Warning)
    }
}

@Composable
fun BillPaymentScreen() {
    Column(verticalArrangement = Arrangement.spacedBy(AppSpacing.Small)) {
        AppCard("Bill Payment", "Split, discount, and quick checkout")
        StatusChip("Ready to pay", AppColors.Success)
    }
}

@Composable
fun OrderHistoryScreen() { AppCard("Order History", "Past orders with filters and receipts") }
