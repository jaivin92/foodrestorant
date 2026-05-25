package com.foodrestorant.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.Home
import androidx.compose.material.icons.rounded.List
import androidx.compose.material.icons.rounded.Payment
import androidx.compose.material.icons.rounded.Restaurant
import androidx.compose.material.icons.rounded.TableRestaurant
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.unit.dp
import com.foodrestorant.ui.theme.AppColors
import com.foodrestorant.ui.theme.AppDimensions
import com.foodrestorant.ui.theme.AppRadius
import com.foodrestorant.ui.theme.AppSpacing

data class NavItem(val label: String, val icon: ImageVector)

val RestaurantNavItems = listOf(
    NavItem("Dashboard", Icons.Rounded.Home),
    NavItem("Tables", Icons.Rounded.TableRestaurant),
    NavItem("Orders", Icons.Rounded.List),
    NavItem("Kitchen", Icons.Rounded.Restaurant),
    NavItem("Bills", Icons.Rounded.Payment)
)

@Composable
fun PrimaryButton(text: String, onClick: () -> Unit, modifier: Modifier = Modifier) {
    Button(
        onClick = onClick,
        modifier = modifier
            .fillMaxWidth()
            .height(AppDimensions.PrimaryButtonHeight),
        shape = RoundedCornerShape(AppRadius.Button),
        colors = ButtonDefaults.buttonColors(containerColor = AppColors.Primary),
        elevation = ButtonDefaults.buttonElevation(defaultElevation = 2.dp)
    ) { Text(text = text, style = MaterialTheme.typography.labelLarge) }
}

@Composable
fun AppCard(title: String, subtitle: String, modifier: Modifier = Modifier) {
    Card(
        modifier = modifier.fillMaxWidth(),
        shape = RoundedCornerShape(AppRadius.Card),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
    ) {
        Column(Modifier.padding(AppSpacing.Medium), verticalArrangement = Arrangement.spacedBy(AppSpacing.Small)) {
            Text(title, style = MaterialTheme.typography.titleLarge)
            Text(subtitle, style = MaterialTheme.typography.bodyLarge, color = AppColors.TextSecondary)
        }
    }
}

@Composable
fun AppTextField(value: String, onValueChange: (String) -> Unit, label: String) {
    OutlinedTextField(
        value = value,
        onValueChange = onValueChange,
        label = { Text(label) },
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(AppRadius.Input)
    )
}

@Composable
fun RestaurantBottomNav(selected: Int, onSelect: (Int) -> Unit) {
    NavigationBar {
        RestaurantNavItems.forEachIndexed { index, item ->
            NavigationBarItem(
                selected = selected == index,
                onClick = { onSelect(index) },
                icon = { Icon(item.icon, contentDescription = item.label) },
                label = { Text(item.label) }
            )
        }
    }
}

@Composable
fun StatusChip(text: String, color: androidx.compose.ui.graphics.Color) {
    Box(
        modifier = Modifier
            .background(color.copy(alpha = 0.12f), RoundedCornerShape(999.dp))
            .padding(horizontal = AppSpacing.Medium, vertical = AppSpacing.Small)
    ) {
        Text(text = text, color = color, style = MaterialTheme.typography.bodySmall)
    }
}
